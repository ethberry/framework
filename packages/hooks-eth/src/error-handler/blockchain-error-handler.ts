import { defaultAbiCoder } from "@ethersproject/abi";

import { BlockchainErrorType, CustomErrorPrefix, IBlockchainError, SystemErrorPrefix } from "./interfaces";
import { panicErrorCodeToReason } from "./panic-code-handler";
import { customErrorToReason } from "./custom-error-handler";

export const parseBlockchainError = (error: string): IBlockchainError => {
  const isEmptyError = error === SystemErrorPrefix.EMPTY;
  const isSystemStringError = error.startsWith(SystemErrorPrefix.ERROR_STRING_PREFIX);
  const isSystemPanicError = error.startsWith(SystemErrorPrefix.PANIC_CODE_PREFIX);
  const isCustomError = Object.keys(CustomErrorPrefix).some(key => error.startsWith(key));

  if (isEmptyError) {
    return { type: BlockchainErrorType.EMPTY, reason: "Empty error" };
  } else if (isSystemStringError) {
    const reason = defaultAbiCoder.decode(
      ["string"],
      `0x${error.slice(SystemErrorPrefix.ERROR_STRING_PREFIX.length)}`,
    )[0] as string;
    return { type: BlockchainErrorType.SYSTEM_STRING, reason };
  } else if (isSystemPanicError) {
    const code = defaultAbiCoder.decode(["uint256"], `0x${error.slice(SystemErrorPrefix.PANIC_CODE_PREFIX.length)}`)[0];
    const reason = panicErrorCodeToReason(code);
    return { type: BlockchainErrorType.SYSTEM_PANIC_CODE, reason };
  } else if (isCustomError) {
    const reason = customErrorToReason(error);
    return { type: BlockchainErrorType.CUSTOM_ERROR, reason };
  }

  return { type: BlockchainErrorType.UNKNOWN_ERROR, reason: error };
};
