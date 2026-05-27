import { forwardRef } from "react";
import { PROJECTS } from "../../constants";
import "./Projects.css";

const Projects = forwardRef(function Projects(_, ref) {
  return (
    <section className="projects" id="projects" ref={ref}>
      <div className="projects-inner">
        <div className="projects-header">
          <h2 className="projects-title">Projects</h2>
        </div>

        <div className="projects-grid">
          {PROJECTS.map((project) => (
            <div key={project.id} className="project-card">
              <div className="project-card-bg" />
              <div className="project-card-content">
                <div className="project-meta">
                  <span className="project-name">{project.title}</span>
                  {project.category && (
                    <span className="project-category">{project.category}</span>
                  )}
                </div>
                <p className="project-desc">{project.description}</p>
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    className="project-link"
                  >
                    View on GitHub →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

export default Projects;
