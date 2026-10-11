const $ = (id) => document.getElementById(id);
const canvas = $("volume");
const status = $("status");
const gl = canvas.getContext("webgl2", { antialias: false, alpha: false });
const FRAMES = 240;
let texture, program, uniforms;
let aspect = 16 / 9, duration = 8, yaw = 0.32, pitch = 0.18, zoom = 1;
let playing = false, busy = false, dirty = true, previous = 0, lost = false;

// A video is a volume: x/y are image coordinates; time runs from +z to -z.
// The current frame recedes from the front, leaving earlier frames ahead of it.
// The unswept block stays opaque with temporal slices on its sides.
// Only the swept region turns into translucent motion trails.
const vertex = `#version 300 es
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;
const fragment = `#version 300 es
precision highp float;
precision highp sampler3D;
uniform sampler3D frames;
uniform vec2 resolution;
uniform vec3 bounds;
uniform vec3 eye;
uniform float scale, cut, density;
out vec4 color;
vec2 intersectBox(vec3 ro, vec3 rd, vec3 lo, vec3 hi) {
  vec3 safe = mix(vec3(-1.0), vec3(1.0), step(vec3(0.0), rd)) * max(abs(rd), vec3(0.000001));
  vec3 a = (lo - ro) / safe, b = (hi - ro) / safe;
  vec3 nearT = min(a, b), farT = max(a, b);
  return vec2(max(max(nearT.x, nearT.y), nearT.z), min(min(farT.x, farT.y), farT.z));
}
vec4 sampleVolume(vec3 p) {
  vec3 uv = p / (bounds * 2.0) + 0.5;
  uv.yz = 1.0 - uv.yz;
  // Map the ends to texel centers, preserving interpolation all the way to
  // the first/last frame instead of holding a half-texel plateau at each end.
  vec3 size = vec3(textureSize(frames, 0));
  uv = (clamp(uv, 0.0, 1.0) * (size - 1.0) + 0.5) / size;
  return texture(frames, uv);
}
float edge(vec3 p) {
  vec3 d = abs(abs(p) - bounds);
  float second = min(max(d.x, d.y), min(max(d.x, d.z), max(d.y, d.z)));
  return 1.0 - smoothstep(0.002, 0.008, second);
}
void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
  vec3 forward = normalize(-eye);
  vec3 right = normalize(cross(forward, vec3(0,1,0)));
  vec3 up = cross(right, forward);
  vec3 ro = eye;
  vec3 rd = normalize(forward * length(eye) + (uv.x * right + uv.y * up) * scale);
  vec3 result = vec3(0.0);
  vec2 box = intersectBox(ro, rd, -bounds, bounds);
  if (box.y < max(box.x, 0.0)) {
    color = vec4(result, 1);
    return;
  }
  float z = mix(bounds.z, -bounds.z, cut);

  // The unswept part is a solid space-time block. Its cut is a complete video
  // frame; its other faces are x/time and y/time slices. No double exposure.
  vec2 solid = intersectBox(ro, rd, -bounds, vec3(bounds.xy, z));
  float solidStart = 1e5;
  if (solid.y >= max(solid.x, 0.0)) {
    solidStart = max(solid.x, 0.0);
    vec3 p = ro + rd * solidStart;
    result = sampleVolume(p).rgb;
    // Slight directional shading distinguishes the top and side from the cut.
    if (abs(p.z - z) > 0.001 && abs(abs(p.z) - bounds.z) > 0.001)
      result *= abs(abs(p.y) - bounds.y) < 0.001 ? 0.88 : 0.76;
  }

  // The swept part leaves visible motion trails in front of the receding frame.
  // Alpha stores temporal change: static pavement no longer forms opaque fog.
  vec2 trail = intersectBox(ro, rd, vec3(-bounds.xy, z), bounds);
  float start = max(trail.x, 0.0);
  float finish = min(trail.y, solidStart);
  if (finish > start) {
    // Sample according to the distance crossed in texture space. A fixed
    // 112 steps skipped frames and produced bands at deeper cuts and angles.
    vec3 texelSpan = abs(rd) * (finish - start) / (bounds * 2.0)
      * vec3(textureSize(frames, 0));
    float steps = clamp(ceil(max(max(texelSpan.x, texelSpan.y), texelSpan.z) * 1.25), 32.0, 384.0);
    float stepSize = (finish - start) / steps;
    vec3 accumulated = vec3(0);
    float opacity = 0.0;
    for (int i = 0; i < 384; i++) {
      if (float(i) >= steps) break;
      vec3 p = ro + rd * (start + (float(i) + 0.5) * stepSize);
      vec4 voxel = sampleVolume(p);
      float a = 1.0 - exp(-density * stepSize * (0.10 + voxel.a * 7.0));
      vec3 trailColor = min(voxel.rgb * 1.04, vec3(1.0));
      accumulated += (1.0 - opacity) * a * trailColor;
      opacity += (1.0 - opacity) * a;
    }
    result = accumulated + (1.0 - opacity) * result;

    // Preserve faint temporal patterns on the swept side walls, but never
    // put a duplicate still on the front or back of the transparent region.
    vec3 p = ro + rd * start;
    vec3 d = abs(abs(p) - bounds);
    if (min(d.x, d.y) < 0.001 && abs(p.z - z) > 0.001) {
      float wallOpacity = 1.0 - exp(-density * 0.6);
      result = mix(result, sampleVolume(p).rgb, wallOpacity);
    }
  }
  float line = max(edge(ro + rd * max(box.x, 0.0)), edge(ro + rd * box.y) * 0.35);
  result = mix(result, vec3(0.30), line * 0.55);
  color = vec4(result, 1);
}`;

function compile(type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(message);
  }
  return shader;
}

function upload(data, width, height) {
  // Reuse RGBA's alpha channel for a motion mask. A temporal mean estimates
  // the static background without requiring a separate segmentation model.
  const stride = width * height * 4;
  const average = new Float32Array(width * height * 3);
  for (let f = 0; f < FRAMES; f++) {
    for (let p = 0, rgb = 0; p < stride; p += 4, rgb += 3) {
      const offset = f * stride + p;
      average[rgb] += data[offset] / FRAMES;
      average[rgb + 1] += data[offset + 1] / FRAMES;
      average[rgb + 2] += data[offset + 2] / FRAMES;
    }
  }
  for (let f = 0; f < FRAMES; f++) {
    for (let p = 0, rgb = 0; p < stride; p += 4, rgb += 3) {
      const offset = f * stride + p;
      const difference = Math.max(
        Math.abs(data[offset] - average[rgb]),
        Math.abs(data[offset + 1] - average[rgb + 1]),
        Math.abs(data[offset + 2] - average[rgb + 2]),
      );
      const weight = Math.max(0, Math.min(1, (difference - 10) / 35));
      data[offset + 3] = Math.round(weight * weight * (3 - 2 * weight) * 255);
    }
  }
  const next = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_3D, next);
  for (const key of [gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T, gl.TEXTURE_WRAP_R])
    gl.texParameteri(gl.TEXTURE_3D, key, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texImage3D(gl.TEXTURE_3D, 0, gl.RGBA8, width, height, FRAMES, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
  if (gl.getError() !== gl.NO_ERROR) {
    gl.deleteTexture(next);
    gl.bindTexture(gl.TEXTURE_3D, texture);
    throw new Error("Not enough graphics memory to load this video.");
  }
  if (texture) gl.deleteTexture(texture);
  texture = next;
  aspect = width / height;
  dirty = true;
}

function makeSample() {
  const w = 256, h = 144;
  const surface = document.createElement("canvas");
  surface.width = w; surface.height = h;
  const ctx = surface.getContext("2d", { willReadFrequently: true });
  ctx.scale(w / 320, h / 180);
  const data = new Uint8Array(w * h * FRAMES * 4);
  for (let i = 0; i < FRAMES; i++) {
    ctx.fillStyle = "#171d1c"; ctx.fillRect(0, 0, 320, 180);
    ctx.strokeStyle = "#303934"; ctx.lineWidth = 0.6;
    for (let x = 0; x < 320; x += 20) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 180); ctx.stroke(); }
    for (let y = 0; y < 180; y += 20) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(320, y); ctx.stroke(); }
    for (let j = 0; j < 5; j++) {
      const t = i / (FRAMES - 1);
      ctx.fillStyle = ["#df785e", "#d9d9ad", "#87b7b5", "#afa3d0", "#b5cf8b"][j];
      ctx.beginPath();
      ctx.arc(22 + t * 275, 30 + j * 29 + Math.sin(t * 5 + j) * 15, 7 + j, 0, Math.PI * 2);
      ctx.fill();
    }
    data.set(ctx.getImageData(0, 0, w, h).data, i * w * h * 4);
  }
  upload(data, w, h);
  duration = 8;
  $("source").textContent = "MOTION SAMPLE";
  status.textContent = "";
}

function mediaEvent(video, name, action) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => finish(new Error("Video loading timed out.")), 20000);
    const success = () => finish();
    const failure = () => finish(new Error("Unable to read this video. Try an H.264 MP4 file."));
    function finish(error) {
      clearTimeout(timer);
      video.removeEventListener(name, success);
      video.removeEventListener("error", failure);
      error ? reject(error) : resolve();
    }
    video.addEventListener(name, success, { once: true });
    video.addEventListener("error", failure, { once: true });
    action();
  });
}

async function loadVideo(url, label) {
  if (busy || lost) return;
  busy = true; setPlaying(false);
  for (const id of ["upload", "sample", "default", "play"]) $(id).disabled = true;
  const video = document.createElement("video");
  video.muted = true; video.playsInline = true; video.preload = "auto";
  status.textContent = "LOADING VIDEO…";
  try {
    await mediaEvent(video, "loadeddata", () => { video.src = url; video.load(); });
    if (!Number.isFinite(video.duration) || video.duration <= 0 || !video.videoWidth)
      throw new Error("Unable to determine the video duration.");
    const seconds = Math.min(8, video.duration);
    const maxSide = Math.min(window.innerWidth < 700 ? 512 : 720, gl.getParameter(gl.MAX_3D_TEXTURE_SIZE));
    const ratio = Math.min(1, maxSide / Math.max(video.videoWidth, video.videoHeight));
    const w = Math.max(2, Math.round(video.videoWidth * ratio));
    const h = Math.max(2, Math.round(video.videoHeight * ratio));
    const surface = document.createElement("canvas");
    surface.width = w; surface.height = h;
    const ctx = surface.getContext("2d", { willReadFrequently: true });
    const data = new Uint8Array(w * h * FRAMES * 4);
    for (let i = 0; i < FRAMES; i++) {
      const time = (seconds - Math.min(1 / 120, seconds / 10)) * i / (FRAMES - 1);
      if (Math.abs(video.currentTime - time) > 0.0001)
        await mediaEvent(video, "seeked", () => { video.currentTime = time; });
      ctx.drawImage(video, 0, 0, w, h);
      data.set(ctx.getImageData(0, 0, w, h).data, i * w * h * 4);
      if (i % 8 === 0) {
        status.textContent = `BUILDING VOLUME · ${Math.round(i / FRAMES * 100)}%`;
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
    }
    if (lost) throw new Error("Graphics connection lost. Reload this page.");
    upload(data, w, h);
    duration = seconds;
    $("source").textContent = label;
    status.textContent = "";
    dirty = true;
  } catch (error) {
    status.textContent = `${error.message} The previous scene is preserved.`;
  } finally {
    video.removeAttribute("src"); video.load();
    if (url.startsWith("blob:")) URL.revokeObjectURL(url);
    busy = false;
    if (!lost) for (const id of ["upload", "sample", "default", "play"]) $(id).disabled = false;
  }
}

function setPlaying(value) {
  playing = value;
  $("play").textContent = playing ? "PAUSE" : "PLAY";
  $("play").setAttribute("aria-pressed", String(playing));
}

function render(now) {
  if (lost) return;
  const dt = Math.min((now - previous) / 1000, 0.05); previous = now;
  if (playing && !document.hidden) {
    $("time").value = (Number($("time").value) + dt / duration) % 1;
    dirty = true;
  }
  if (dirty && texture && !document.hidden) {
    dirty = false;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    // Limit ray-marching cost on retina and mobile displays.
    const factor = Math.min(dpr, 1440 / Math.max(rect.width, rect.height));
    const renderWidth = Math.max(1, Math.round(rect.width * factor));
    const renderHeight = Math.max(1, Math.round(rect.height * factor));
    if (canvas.width !== renderWidth) canvas.width = renderWidth;
    if (canvas.height !== renderHeight) canvas.height = renderHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
    const width = Math.min(aspect, 1.78), height = width / aspect;
    gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
    gl.uniform3f(uniforms.bounds, width, height, Number($("depth").value));
    gl.uniform3f(uniforms.eye, Math.sin(yaw) * Math.cos(pitch) * 10, Math.sin(pitch) * 10, Math.cos(yaw) * Math.cos(pitch) * 10);
    gl.uniform1f(uniforms.scale, 2.9 / zoom);
    gl.uniform1f(uniforms.cut, Number($("time").value));
    gl.uniform1f(uniforms.density, Number($("density").value));
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    $("time-value").textContent = `${(Number($("time").value) * duration).toFixed(2)} s`;
    $("time").setAttribute("aria-valuetext", $("time-value").textContent);
    $("density-value").textContent = `${Math.round(Number($("density").value) * 100)}%`;
    $("depth-value").textContent = Number($("depth").value).toFixed(2);
  }
  requestAnimationFrame(render);
}

function initialize() {
  if (!gl) throw new Error("WebGL 2 is unavailable. Enable hardware acceleration or try another browser.");
  program = gl.createProgram();
  const shaders = [compile(gl.VERTEX_SHADER, vertex), compile(gl.FRAGMENT_SHADER, fragment)];
  for (const shader of shaders) gl.attachShader(program, shader);
  gl.linkProgram(program);
  for (const shader of shaders) gl.deleteShader(shader);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
  gl.useProgram(program);
  uniforms = Object.fromEntries(["resolution", "bounds", "eye", "scale", "cut", "density"].map((key) => [key, gl.getUniformLocation(program, key)]));
  gl.uniform1i(gl.getUniformLocation(program, "frames"), 0);
  gl.bindVertexArray(gl.createVertexArray());
  makeSample();
  requestAnimationFrame(render);
  new ResizeObserver(() => { dirty = true; }).observe(canvas);
  document.addEventListener("visibilitychange", () => { dirty = true; });
  for (const id of ["time", "density", "depth"]) $(id).addEventListener("input", () => { dirty = true; if (id === "time") setPlaying(false); });
  $("play").onclick = () => setPlaying(!playing);
  $("reset").onclick = () => { yaw = 0.32; pitch = 0.18; zoom = 1; dirty = true; };
  $("sample").onclick = () => { setPlaying(false); makeSample(); };
  $("default").onclick = () => loadVideo("./crosswalk.mp4", "SHIBUYA · NIGHTINGALE");
  $("upload").onclick = () => $("file").click();
  $("file").onchange = () => {
    const file = $("file").files[0];
    if (file) loadVideo(URL.createObjectURL(file), file.name);
    $("file").value = "";
  };
  const sourceMenu = $("source-menu");
  document.addEventListener("click", (event) => {
    if (!sourceMenu.contains(event.target)) sourceMenu.open = false;
  });
  sourceMenu.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      sourceMenu.open = false;
      sourceMenu.querySelector("summary").focus();
    }
  });
  let drag = null;
  canvas.onpointerdown = (event) => {
    if (drag || event.button !== 0) return;
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY };
    canvas.setPointerCapture(event.pointerId);
  };
  canvas.onpointermove = (event) => {
    if (!drag || drag.id !== event.pointerId) return;
    yaw -= (event.clientX - drag.x) * 0.007;
    pitch = Math.max(-1.4, Math.min(1.4, pitch + (event.clientY - drag.y) * 0.007));
    drag.x = event.clientX; drag.y = event.clientY; dirty = true;
  };
  canvas.onpointerup = canvas.onpointercancel = canvas.onlostpointercapture = () => { drag = null; };
  canvas.addEventListener("wheel", (event) => {
    event.preventDefault();
    zoom = Math.max(0.55, Math.min(3.5, zoom * Math.exp(-event.deltaY * 0.001)));
    dirty = true;
  }, { passive: false });
  canvas.onkeydown = (event) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "+", "=", "-"].includes(event.key)) return;
    event.preventDefault();
    if (event.key === "ArrowLeft") yaw -= 0.08;
    if (event.key === "ArrowRight") yaw += 0.08;
    if (event.key === "ArrowUp") pitch = Math.min(1.4, pitch + 0.08);
    if (event.key === "ArrowDown") pitch = Math.max(-1.4, pitch - 0.08);
    if (event.key === "+" || event.key === "=") zoom = Math.min(3.5, zoom * 1.1);
    if (event.key === "-") zoom = Math.max(0.55, zoom / 1.1);
    dirty = true;
  };
  canvas.addEventListener("webglcontextlost", (event) => {
    event.preventDefault(); lost = true; setPlaying(false);
    status.textContent = "Graphics connection lost. Reload this page.";
    document.querySelectorAll("button, input").forEach((el) => { el.disabled = true; });
  });
  loadVideo("./crosswalk.mp4", "SHIBUYA · NIGHTINGALE");
}

try { initialize(); }
catch (error) {
  status.textContent = error.message;
  document.querySelectorAll("button, input").forEach((el) => { el.disabled = true; });
}
