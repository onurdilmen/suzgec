/*
 * Evaluates `!#if … / !#else / !#endif` blocks found in uBlock/AdGuard lists and drops
 * `!#include` lines. Unknown tokens evaluate to false.
 */

// Süzgeç behaves like an MV3 Chromium extension (closest match: uBO Lite).
export const ENV = Object.freeze({
  env_chromium: true,
  env_mv3: true,
  ext_ubol: true,
  adguard: true,
  adguard_ext_chromium: true,
  adguard_ext_chromium_mv3: true,
  cap_html_filtering: false,
  cap_user_stylesheet: true,
  false: false,
});

const tokenize = (expression) => expression.match(/!|&&|\|\||\(|\)|[A-Za-z0-9_]+/g) ?? [];

// Small recursive-descent evaluator: or := and ('||' and)* ; and := unary ('&&' unary)* ; unary := '!' unary | '(' or ')' | ident
export const evaluateCondition = (expression, env = ENV) => {
  const tokens = tokenize(expression);
  let index = 0;
  const peek = () => tokens[index];
  const next = () => tokens[index++];
  const unary = () => {
    const token = next();
    if (token === '!') return !unary();
    if (token === '(') {
      const value = or();
      next(); // ')'
      return value;
    }
    return Boolean(env[token]);
  };
  const and = () => {
    let value = unary();
    while (peek() === '&&') {
      next();
      value = unary() && value;
    }
    return value;
  };
  const or = () => {
    let value = and();
    while (peek() === '||') {
      next();
      value = and() || value;
    }
    return value;
  };
  return tokens.length ? or() : false;
};

/** @returns {string[]} lines that are active in ENV */
export const preprocess = (text, env = ENV) => {
  const out = [];
  const stack = []; // each entry: { active, parentActive }
  const active = () => stack.every((s) => s.active);
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (line.startsWith('!#if')) {
      stack.push({ active: evaluateCondition(line.slice(4), env) });
      continue;
    }
    if (line.startsWith('!#else')) {
      const top = stack.at(-1);
      if (top) top.active = !top.active;
      continue;
    }
    if (line.startsWith('!#endif')) {
      stack.pop();
      continue;
    }
    if (line.startsWith('!#include')) continue;
    if (active()) out.push(line);
  }
  return out;
};
