import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";

import { UniStaking, ERC721Random } from "../../typechain-types";
import { DEFAULT_ADMIN_ROLE, PAUSER_ROLE, _stakePeriod } from "../constants";
import { shouldHaveRole } from "../shared/accessControl/hasRoles";

interface IRule {
  deposit: IItem;
  reward: IItem;
  period: BigNumber;
  penalty: BigNumber;
  recurrent: boolean;
  active: boolean;
}

interface IItem {
  itemType: BigNumber;
  token: string;
  tokenData: IItemData;
  amount: BigNumber;
}

//
interface IItemData {
  tokenId: BigNumber;
  templateId: BigNumber;
}

const transform = (args: any): Record<string, any> => {
  return JSON.parse(JSON.stringify(Object.fromEntries(Object.entries(args).splice(args.length)))) as Record<
    string,
    any
  >;
};

// enum ItemType {
// // 0: ETH on mainnet, MATIC on polygon, etc.
// NATIVE,
//   // 1: ERC20 items (ERC777 and other ERC20 analogues could also technically work)
//   ERC20,
//   // 2: ERC721 items
//   ERC721,
//   // 3: ERC1155 items
//   ERC1155
// }
// interface ItemType {
//   itemType = 0 | 1 | 2 | 3 | 4;
// }

describe("UniStaking", function () {
  let stakingInstance: UniStaking;
  let erc721RandomInstance: ERC721Random;

  beforeEach(async function () {
    [this.owner, this.receiver] = await ethers.getSigners();

    // UniStaking
    const stakingFactory = await ethers.getContractFactory("UniStaking");
    stakingInstance = await stakingFactory.deploy();
    // ERC721 Random
    const itemFactory = await ethers.getContractFactory("ERC721Random");
    erc721RandomInstance = await itemFactory.deploy("ERC721Random", "RND", "https://localhost", 100);
  });

  shouldHaveRole(DEFAULT_ADMIN_ROLE, PAUSER_ROLE);

  describe("setRule", function () {
    // it("should fail for wrong role", async function () {
    //   const tx = stakingInstance.connect(this.receiver).mintBatch(this.receiver.address, [tokenId], [amount], "0x");
    //   await expect(tx).to.be.revertedWith(
    //     `AccessControl: account ${this.receiver.address.toLowerCase()} is missing role ${MINTER_ROLE}`,
    //   );
    // });

    it.only("should set Rules", async function () {
      // const ruleArray = [[[deposit], [reward], period, penalty, recurrent, active]];
      // enum ItemType {
      // 0: ETH on mainnet, MATIC on polygon, etc.
      // 1: ERC20 items (ERC777 and other ERC20 analogues could also technically work)
      // 2: ERC721 items
      // 3: ERC721Random items
      // 4: ERC1155 items
      // }
      // [itemType, "tokenAddress", [[tokenId, templateId, dropboxId]], amount], // deposit or reward struct

      const stakePeriod = _stakePeriod; // stake time 60 sec
      const stakePenalty = 0; // penalty???

      const depositToken: IItem = {
        // NATIVE ETH deposit
        itemType: BigNumber.from(0),
        token: "0x0000000000000000000000000000000000000000",
        tokenData: { tokenId: BigNumber.from(0), templateId: BigNumber.from(0) },
        amount: BigNumber.from(1000),
      };

      const rewardToken: IItem = {
        // ERC721 Random
        itemType: BigNumber.from(3),
        token: erc721RandomInstance.address,
        tokenData: { tokenId: BigNumber.from(1000), templateId: BigNumber.from(1) },
        amount: BigNumber.from(0),
      };

      const stakeRule: IRule = {
        deposit: depositToken,
        reward: rewardToken,
        period: BigNumber.from(stakePeriod),
        penalty: BigNumber.from(stakePenalty),
        recurrent: false,
        active: true,
      };

      const rulesArray = [stakeRule];

      // const xx = [
      //   {
      //     ...stakeRule,
      //     deposit: Object.values(stakeRule.deposit),
      //     reward: Object.values(stakeRule.reward),
      //   },
      // ];

      const txx = await stakingInstance.setRules(rulesArray);
      const res = await txx.wait();
      if (res && res.events) {
        const args = res.events[0]!.args;
        // console.log("args", args);
        const trarg = transform(args!.rule);
        console.log("trarg", trarg);
        const rulearg = transform(stakeRule);
        console.log("rulearg", rulearg);
        // expect(trarg).to.equal(rulearg);
      }

      // const tx = stakingInstance.setRules(rulesArray);
      // await expect(tx).to.emit(stakingInstance, "RuleCreated").withArgs(BigNumber.from(1), [xx]);
      // expect(trarg).to.equal(rulearg);
    });
  });
});
