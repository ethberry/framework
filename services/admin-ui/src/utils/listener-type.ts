import { ModuleType, TokenType } from "@framework/types";

import { ListenerType } from "@framework/types";

export const getListenerType = (props: {
  contractType?: TokenType;
  contractModule?: ModuleType;
  isVesting?: boolean;
}) => {
  const { contractType, contractModule, isVesting } = props;
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
        case ModuleType.PYRAMID:
          return ListenerType.PYRAMID;
        default:
          switch (isVesting) {
            case true:
              return ListenerType.VESTING;
            default:
              return ListenerType.ERC20;
          }
      }
  }
};
