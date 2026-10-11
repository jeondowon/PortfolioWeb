# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server at http://localhost:5173
npm run build     # Production build to dist/
npm run preview   # Preview the production build
```

## 1. use Korean

**Use Korean when explaining**

- The user is Korean, therefore, always use Korean even when the user asks in English.
- Always use honorific, formal language (존댓말 사용)

## 2. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:

- State what you've understood, and explain it before action. Ask to proceed.
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 3. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 4. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:

- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 5. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:

- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

## 6. Don't add claude as contributor/co-author

**Do not add claude as colloaborator/contributor/co-author when commit/push/making a PR**

## 7. Always use Roboto for texts.

**Font must be Roboto. always use Roboto for text components. You can change the thickness or size, but do not change the font itself.**

## 8. Keep UI copy minimal

- 화면의 부가 설명은 최소화합니다. 제목과 조작 요소만으로 이해할 수 있다면 설명을 덧붙이지 않습니다.
- “다 가질 순 없으니까”, “당신의 선택은?” 같은 장식적인 문구, 불필요한 안내·슬로건, 화면에 이미 드러나는 상태를 반복하는 문구는 생략합니다.
- 사용에 꼭 필요한 레이블, 오류 메시지, 결과 피드백만 간결하게 남깁니다.
- 화면 문구를 줄이더라도 접근성 이름과 필요한 스크린 리더 알림은 유지합니다.
