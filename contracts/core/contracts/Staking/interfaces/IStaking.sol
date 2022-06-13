// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity >=0.8.13;

interface IStaking {
  enum ItemType {
    // 0: ETH on mainnet, MATIC on polygon, etc.
    NATIVE,
    // 1: ERC20 items (ERC777 and other ERC20 analogues could also technically work)
    ERC20,
    // 2: ERC721 items
    ERC721,
    // 3: ERC1155 items
    ERC1155
  }

  struct Item {
    ItemType itemType;
    address token;
    TokenData tokenData;
    uint256 amount;
  }

  struct TokenData {
    uint256 tokenId;
    uint256 templateId;
  }

  struct Rule {
    Item deposit;
    Item reward;
    uint256 period;
    uint256 penalty;
    bool recurrent;
    bool active;
  }

  struct Stake {
    address owner;
    Item deposit;
    uint256 ruleId;
    uint256 startTimestamp;
    uint256 cycles;
  }

  event RuleCreated(uint256 ruleId, Rule rule);
}
