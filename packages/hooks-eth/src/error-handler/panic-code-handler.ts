import { PanicCodes, PanicReasons } from "./interfaces";

export const panicErrorCodeToReason = (errorCode: string): string => {
  const code = parseInt(errorCode, 16);
  for (const key in PanicCodes) {
    if (PanicCodes[key as keyof typeof PanicCodes] === code) {
      return PanicReasons[key as keyof typeof PanicReasons];
    }
  }
  return "Unknown panic code";
};
