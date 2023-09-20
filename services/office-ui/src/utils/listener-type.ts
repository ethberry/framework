import { IContract, ListenerType, ModuleType, TokenType, ContractFeatures } from "@framework/types";

export const ifRandom = (contractFeatures: ContractFeatures[]) => {
  if (contractFeatures.includes(ContractFeatures.RANDOM) || contractFeatures.includes(ContractFeatures.GENES)) {
    return "RANDOM";
  } else {
    return "COMMON";
  }
};

export const getListenerType = (contract: IContract) => {
  const { contractType, contractModule, contractFeatures } = contract;
  switch (contractModule) {
    case ModuleType.MYSTERY:
      return ListenerType.MYSTERYBOX;
    case ModuleType.VESTING:
      return ListenerType.VESTING;
    case ModuleType.STAKING:
      return ListenerType.STAKING;
    case ModuleType.PONZI:
      return ListenerType.PONZI;
    case ModuleType.WAITLIST:
      return ListenerType.WAITLIST;
    case ModuleType.LOTTERY:
      switch (contractType) {
        case TokenType.ERC721:
          return ListenerType.LOTTERY_TICKET;
        default:
          return ListenerType.LOTTERY;
      }
    case ModuleType.RAFFLE:
      switch (contractType) {
        case TokenType.ERC721:
          return ListenerType.RAFFLE_TICKET;
        default:
          return ListenerType.RAFFLE;
      }
    case ModuleType.HIERARCHY:
      switch (contractType) {
        case TokenType.ERC20:
          return ListenerType.ERC20;
        case TokenType.ERC1155:
          return ListenerType.ERC1155;
        case TokenType.ERC721:
          switch (ifRandom(contractFeatures)) {
            case "COMMON":
              return ListenerType.ERC721;
            case "RANDOM":
              return ListenerType.ERC721_RANDOM;
            default: // Should never happen
              return ListenerType.ERC721;
          }
        case TokenType.ERC998:
          switch (ifRandom(contractFeatures)) {
            case "COMMON":
              return ListenerType.ERC998;
            case "RANDOM":
              return ListenerType.ERC998_RANDOM;
            default: // Should never happen
              return ListenerType.ERC998;
          }
        default: // NATIVE
          throw new Error("wrong listener type: NATIVE");
      }
    default:
      throw new Error("wrong listener type");
  }
};
