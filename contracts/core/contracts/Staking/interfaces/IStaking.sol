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
    // 3: ERC998 heroes
    ERC998,
    // 4: ERC1155 items
    ERC1155
  }

  struct Item {
    ItemType itemType;
    address token;
    uint256 tokenId; // or templateId or dropboxId
    uint256 amount;
  }

  struct Rule {
    Item deposit;
    Item reward;
    uint256 period;
    uint256 penalty;
    bool recurrent;
    bool active;
    uint256 externalId;
  }

  struct Stake {
    address owner;
    Item deposit;
    uint256 ruleId;
    uint256 startTimestamp;
    uint256 cycles;
    bool activeDeposit;
  }

  event RuleCreated(uint256 ruleId, Rule rule, uint256 externalId);
  event RuleUpdated(uint256 ruleId, bool active);
}
