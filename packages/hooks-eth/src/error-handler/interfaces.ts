export interface IBlockchainError {
  type: BlockchainErrorType;
  reason: string;
}

export enum BlockchainErrorType {
  EMPTY = "EMPTY",
  SYSTEM_STRING = "SYSTEM_STRING",
  SYSTEM_PANIC_CODE = "SYSTEM_PANIC_CODE",
  CUSTOM_ERROR = "CUSTOM_ERROR",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

export enum SystemErrorPrefix {
  EMPTY = "0x",
  ERROR_STRING_PREFIX = "0x08c379a0",
  PANIC_CODE_PREFIX = "0x4e487b71",
}

export enum CustomErrorPrefix {
  "0xf0f16622" = "BalanceExceed",
  "0x1c97df40" = "CountExceed",
  "0x203d82d8" = "Expired",
  "0xdf4cc36d" = "ExpiredSignature",
  "0x4fce92cf" = "LimitExceed",
  "0xcd7ee2ee" = "MethodNotSupported",
  "0x80cb55e2" = "NotActive",
  "0xeea91ff8" = "NotAnOwner",
  "0x0701727f" = "NotComplete",
  "0xad5679e1" = "NotExist",
  "0x354c44dd" = "RefProgramSet",
  "0x255a6a43" = "SignerMissingRole",
  "0x5c201a4d" = "TemplateZero",
  "0xd78b7d54" = "UnsupportedTokenType",
  "0x49986e73" = "WrongAmount",
  "0x517070ee" = "WrongRule",
  "0x67f3734e" = "WrongStake",
  "0xa0f3feea" = "WrongToken",
  "0x669567ea" = "ZeroBalance",
  "0xcfa51274" = "AlreadyExist",
  "0xc7486273" = "NotInList",
  "0xab36f391" = "ProtectedAttribute",
  "0x2a00e5c6" = "WrongArrayLength",
  "0xf7760f25" = "WrongPrice",
  "0x76699990" = "WrongRole",
  "0xc3fa7054" = "WrongRound",
  // VRF
  "0xa09709f0" = "BalanceInvariantViolated",
  "0x1d4d7a67" = "BlockhashNotInStore",
  "0x9019609e" = "GasLimitTooBig",
  "0xd529142c" = "IncorrectCommitment",
  "0xf4d678b8" = "InsufficientBalance",
  "0xc21c263f" = "InsufficientGasForConsumer",
  "0x8129bbcd" = "InvalidCalldata",
  "0x71e83137" = "InvalidConsumer",
  "0x829bbdf4" = "InvalidLinkWeiPrice",
  "0xfebcaec2" = "InvalidRequestConfirmations",
  "0x1f6a65b6" = "InvalidSubscription",
  "0xf64e4336" = "MustBeRequestedOwner",
  "0x7aa88a78" = "MustBeSubOwner",
  "0x3688124a" = "NoCorrespondingRequest",
  "0x699abf21" = "NoSuchProvingKey",
  "0xca19859f" = "NumWordsTooBig",
  "0x44b0e3c3" = "OnlyCallableFromLink",
  "0xe80fa381" = "PaymentTooLarge",
  "0xb42f66e8" = "PendingRequestExists",
  "0xad83ac91" = "ProvingKeyAlreadyRegistered",
  "0xed3ba6a6" = "Reentrant",
  "0x05a48e0f" = "TooManyConsumers",
}

export enum PanicCodes {
  ASSERTION_ERROR = 0x1,
  ARITHMETIC_UNDER_OR_OVERFLOW = 0x11,
  DIVISION_BY_ZERO = 0x12,
  ENUM_CONVERSION_OUT_OF_BOUNDS = 0x21,
  INCORRECTLY_ENCODED_STORAGE_BYTE_ARRAY = 0x22,
  POP_ON_EMPTY_ARRAY = 0x31,
  ARRAY_ACCESS_OUT_OF_BOUNDS = 0x32,
  TOO_MUCH_MEMORY_ALLOCATED = 0x41,
  ZERO_INITIALIZED_VARIABLE = 0x51,
}

export enum PanicReasons {
  ASSERTION_ERROR = "Assertion error",
  ARITHMETIC_UNDER_OR_OVERFLOW = "Arithmetic operation underflowed or overflowed outside of an unchecked block",
  DIVISION_BY_ZERO = "Division or modulo division by zero",
  ENUM_CONVERSION_OUT_OF_BOUNDS = "Tried to convert a value into an enum, but the value was too big or negative",
  INCORRECTLY_ENCODED_STORAGE_BYTE_ARRAY = "Incorrectly encoded storage byte array",
  POP_ON_EMPTY_ARRAY = ".pop() was called on an empty array",
  ARRAY_ACCESS_OUT_OF_BOUNDS = "Array accessed at an out-of-bounds or negative index",
  TOO_MUCH_MEMORY_ALLOCATED = "Too much memory was allocated, or an array was created that is too large",
  ZERO_INITIALIZED_VARIABLE = "Called a zero-initialized variable of internal function type",
}
