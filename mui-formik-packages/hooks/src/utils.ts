import { defaultDecoder } from "qs";

// https://github.com/ljharb/qs/issues/91#issuecomment-522289267
export const decoder = (str: string, _decoder: defaultDecoder, charset: string): any => {
  const strWithoutPlus = str.replace(/\+/g, " ");
  if (charset === "iso-8859-1") {
    // unescape never throws, no try...catch needed:
    return strWithoutPlus.replace(/%[0-9a-f]{2}/gi, unescape);
  }

  if (/^(\d+|\d*\.\d+)$/.test(str)) {
    return parseFloat(str);
  }

  const keywords: Record<string, any> = {
    true: true,
    false: false,
    null: null,
    undefined: void 0,
  };

  if (str in keywords) {
    return keywords[str];
  }

  try {
    return decodeURIComponent(strWithoutPlus);
  } catch (e) {
    return strWithoutPlus;
  }
};
