import { IContract, ListenerType, ModuleType, TokenType } from "@framework/types";

export const getListenerType = (contract: IContract) => {
  const { contractType, contractModule } = contract;
  switch (contractType) {
    case TokenType.ERC20:
      return ListenerType.ERC20;
    case TokenType.ERC721:
      switch (contractModule) {
        case ModuleType.HIERARCHY:
          return ListenerType.ERC721;
        case ModuleType.MYSTERY:
          return ListenerType.MYSTERYBOX;
        default:
          return ListenerType.ERC721;
      }
    case TokenType.ERC998:
      return ListenerType.ERC998;
    case TokenType.ERC1155:
      return ListenerType.ERC1155;
    default:
      switch (contractModule) {
        case ModuleType.PONZI:
          return ListenerType.PONZI;
        default:
          return ListenerType.ERC20;
      }
  }
};
