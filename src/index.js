const parser = require("./util/parser");

const escape = input => String(input).replace(/[,.*[\]{}]/g, "\\$&");

module.exports = (needles, {
  filterFn = undefined,
  breakFn = undefined,
  joined = true
} = {}) => {
  const search = needles.map(parser);

  const find = (haystack, checks, pathIn = []) => {
    const result = [];
    if (checks.some(check => check.length === 0)) {
      if (filterFn === undefined || filterFn(pathIn.map(escape).join("."), haystack)) {
        result.push(joined ? pathIn.reduce((p, c) => {
          const isNumber = typeof c === "number";
          return `${p}${p === "" || isNumber ? "" : "."}${isNumber ? `[${c}]` : c}`;
        }, "") : pathIn);
      }
    }
    if (breakFn === undefined || !breakFn(pathIn.map(escape).join("."), haystack)) {
      if (haystack instanceof Object) {
        if (Array.isArray(haystack)) {
          for (let i = 0; i < haystack.length; i += 1) {
            checks
              .filter(check => check.length !== 0)
              .forEach((check) => {
                const pathOut = [].concat(...pathIn).concat(i);
                if (check[0] === "**") {
                  result.push(...find(haystack[i], [check, check.slice(1)], pathOut));
                } else if (
                  check[0] === "[*]"
                  || check[0] === `[${i}]`
                  || (check[0] instanceof Array && check[0].includes(`[${i}]`))
                ) {
                  result.push(...find(haystack[i], [check.slice(1)], pathOut));
                }
              });
          }
        } else {
          Object.entries(haystack).forEach(([key, value]) => {
            checks
              .filter(check => check.length !== 0)
              .forEach((check) => {
                const escapedKey = escape(key);
                const pathOut = [].concat(...pathIn).concat(key);
                if (check[0] === "**") {
                  result.push(...find(value, [check, check.slice(1)], pathOut));
                } else if (
                  check[0] === "*"
                  || check[0] === escapedKey
                  || (check[0] instanceof Array && check[0].includes(escapedKey))
                ) {
                  result.push(...find(value, [check.slice(1)], pathOut));
                }
              });
          });
        }
      }
    }
    return result;
  };

  return haystack => find(haystack, search);
};