export const compare = (a1: Set<string>, a2: Set<string>) =>
  // eslint-disable-next-line no-constant-binary-expression
  (a1 = new Set(a1)) && (a2 = new Set(a2)) && a1.size === a2.size && [...a1].every(v => a2.has(v));
