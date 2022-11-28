import { ethers } from "hardhat";
import { Contract, constants } from "ethers";
import { wallet, wallets } from "@gemunion/constants";

import { blockAwait, blockAwaitMs } from "../utils/blockAwait";
import { baseTokenURI, MINTER_ROLE, royalty } from "../../test/constants";

const camelToSnakeCase = (str: string) => str.replace(/[A-Z]/g, letter => `_${letter}`);
const delay = 2; // block delay
const delayMs = 1000; // block delay ms
const linkAmountInEth = ethers.utils.parseEther("1");

interface IObj {
  address?: string;
  hash?: string;
}

const debug = async (obj: IObj | Record<string, Contract>, name?: string) => {
  if (obj && obj.hash) {
    console.info(`${name} tx: ${obj.hash}`);
    await blockAwaitMs(delayMs);
  } else {
    console.info(`${Object.keys(obj).pop()} deployed`);
    await blockAwait(delay);
  }
};

const grantRoles = async (contracts: Array<string>, grantee: Array<string>, roles: Array<string>) => {
  for (let i = 0; i < contracts.length; i++) {
    for (let j = 0; j < grantee.length; j++) {
      for (let k = 0; k < roles.length; k++) {
        if (contracts[i] !== grantee[j]) {
          const accessFabric = await ethers.getContractFactory("ERC721Simple");
          const accessInstance = accessFabric.attach(contracts[i]);
          console.info("grantRole", contracts[i], grantee[j]);
          await debug(await accessInstance.grantRole(roles[k], grantee[j]), "grantRole");
        }
      }
    }
  }
};

const contracts: Record<string, Contract> = {};
const amount = constants.WeiPerEther.mul(1e6);
const timestamp = Math.ceil(Date.now() / 1000);

async function main() {
  const [owner] = await ethers.getSigners();
  // LINK & VRF
  // const decimals = ethers.BigNumber.from(10).pow(18);
  // const linkAmountInWei = ethers.BigNumber.from("1000").mul(decimals);
  // const linkFactory = await ethers.getContractFactory("LinkErc20");
  // // // const linkInstance = linkFactory.attach("0x18C8044BEaf97a626E2130Fe324245b96F81A31F");
  // const linkInstance = await linkFactory.deploy("LINK", "LINK");
  // contracts.link = linkInstance;
  // await debug(contracts);
  // console.info(`LINK_ADDR=${contracts.link.address}`);
  // const vrfFactory = await ethers.getContractFactory("VRFCoordinatorMock");
  // contracts.vrf = await vrfFactory.deploy(contracts.link.address);
  // await debug(contracts);
  // console.info(`VRF_ADDR=${contracts.vrf.address}`);
  // await debug(await linkInstance.mint(owner.address, linkAmountInWei.mul(100)), "LinkInstance.mint");
  // console.info("afterDebug");
  // process.exit(0);
  // HAVE TO PASS VRF AND LINK ADDRESSES TO CHAINLINK-BESU CONCTRACT
  const link = await ethers.getContractFactory("LinkErc20");
  const linkInstance = link.attach("0x8BCaF30fed623A721aB6A2E9A9ed4f0b2F141Bfd"); // localhost BESU
  // const linkInstance = link.attach("0x1fa66727cDD4e3e4a6debE4adF84985873F6cd8a"); // Gemunion BESU
  // const linkInstance = link.attach("0x326C977E6efc84E512bB9C30f76E30c160eD06FB"); // GOERLI
  // const linkInstance = link.attach("0x18C8044BEaf97a626E2130Fe324245b96F81A31F"); // GOERLI FW TEST

  const cmFactory = await ethers.getContractFactory("ContractManager");
  // contracts.contractManager = cmFactory.attach("0x690579e4b583dd87db51361e30e0b3493d5c5e6c");

  contracts.contractManager = await cmFactory.deploy();
  await debug(contracts);

  const exchangeFactory = await ethers.getContractFactory("Exchange");
  const exchangeInstance = await exchangeFactory.deploy(
    "Exchange",
    [
      "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73",
      "0x627306090abaB3A6e1400e9345bC60c78a8BEf57",
      "0x61284003e50b2d7ca2b95f93857abb78a1b0f3ca",
    ],
    [1, 5, 95],
  );
  contracts.exchange = exchangeInstance;
  await debug(contracts);

  await debug(
    await contracts.contractManager.setFactories([exchangeInstance.address], [contracts.contractManager.address]),
    "contractManager.setFactories",
  );

  const erc20SimpleFactory = await ethers.getContractFactory("ERC20Simple");
  const erc20SimpleInstance = await erc20SimpleFactory.deploy("Space Credits", "GEM20", amount);
  // const erc20SimpleInstance = erc20SimpleFactory.attach("0x7b3f38cd327c375d7baae448c1380397d304fcec");
  contracts.erc20Simple = erc20SimpleInstance;
  await debug(contracts);

  await debug(await erc20SimpleInstance.mint(owner.address, amount), "erc20SimpleInstance.mint");

  await debug(await erc20SimpleInstance.approve(contracts.exchange.address, amount), "erc20SimpleInstance.approve");

  const erc20InactiveFactory = await ethers.getContractFactory("ERC20Simple");
  contracts.erc20Inactive = await erc20InactiveFactory.deploy("ERC20 INACTIVE", "OFF20", amount);
  await debug(contracts);

  const erc20NewFactory = await ethers.getContractFactory("ERC20Simple");
  contracts.erc20New = await erc20NewFactory.deploy("ERC20 NEW", "NEW20", amount);
  await debug(contracts);

  const erc20BlacklistFactory = await ethers.getContractFactory("ERC20Blacklist");
  const erc20BlacklistInstance = await erc20BlacklistFactory.deploy("ERC20 BLACKLIST", "BL20", amount);
  contracts.erc20Blacklist = erc20BlacklistInstance;
  await debug(contracts);

  await debug(await erc20BlacklistInstance.blacklist(wallets[1]), "erc20BlacklistInstance.blacklist");

  await debug(await erc20BlacklistInstance.blacklist(wallets[2]), "erc20BlacklistInstance.blacklist");

  const erc721SimpleFactory = await ethers.getContractFactory("ERC721Simple");
  contracts.erc721Simple = await erc721SimpleFactory.deploy("RUNE", "GEM721", royalty, baseTokenURI);
  await debug(contracts);

  const erc721InactiveFactory = await ethers.getContractFactory("ERC721Simple");
  contracts.erc721Inactive = await erc721InactiveFactory.deploy("ERC721 INACTIVE", "OFF721", royalty, baseTokenURI);
  await debug(contracts);

  const erc721NewFactory = await ethers.getContractFactory("ERC721Simple");
  contracts.erc721New = await erc721NewFactory.deploy("ERC721 NEW", "NEW721", royalty, baseTokenURI);
  await debug(contracts);

  const erc721BlacklistFactory = await ethers.getContractFactory("ERC721Blacklist");
  contracts.erc721Blacklist = await erc721BlacklistFactory.deploy("ERC721 BLACKLIST", "BL721", royalty, baseTokenURI);
  await debug(contracts);

  const ERC721UpgradeableFactory = await ethers.getContractFactory("ERC721Upgradeable");
  contracts.erc721Upgradeable = await ERC721UpgradeableFactory.deploy("ERC721 ARMOUR", "LVL721", royalty, baseTokenURI);
  await debug(contracts);

  // const erc721RandomFactory = await ethers.getContractFactory("ERC721RandomGemunion");
  // const erc721RandomFactory = await ethers.getContractFactory("ERC721RandomGoerli");
  const erc721RandomFactory = await ethers.getContractFactory("ERC721RandomBesu");
  // const erc721RandomFactory = await ethers.getContractFactory("ERC721Random");
  contracts.erc721Random = await erc721RandomFactory.deploy("ERC721 WEAPON", "RNG721", royalty, baseTokenURI);
  await debug(contracts);

  await debug(await linkInstance.transfer(contracts.erc721Random.address, linkAmountInEth), "linkInstance.transfer");

  const erc721SoulboundFactory = await ethers.getContractFactory("ERC721Soulbound");
  contracts.erc721Soulbound = await erc721SoulboundFactory.deploy("ERC721 MEDAL", "SB721", royalty, baseTokenURI);
  await debug(contracts);

  const erc998SimpleFactory = await ethers.getContractFactory("ERC998Simple");
  contracts.erc998Simple = await erc998SimpleFactory.deploy("ERC998 SIMPLE", "GEM998", royalty, baseTokenURI);
  await debug(contracts);

  const erc998InactiveFactory = await ethers.getContractFactory("ERC998Simple");
  contracts.erc998Inactive = await erc998InactiveFactory.deploy("ERC998 INACTIVE", "OFF998", royalty, baseTokenURI);
  await debug(contracts);

  const erc998NewFactory = await ethers.getContractFactory("ERC998Simple");
  contracts.erc998New = await erc998NewFactory.deploy("ERC998 NEW", "NEW998", royalty, baseTokenURI);
  await debug(contracts);

  const erc998BlacklistFactory = await ethers.getContractFactory("ERC998Blacklist");
  contracts.erc998Blacklist = await erc998BlacklistFactory.deploy("ERC998 BLACKLIST", "BL998", royalty, baseTokenURI);
  await debug(contracts);

  const ERC998UpgradeableFactory = await ethers.getContractFactory("ERC998Upgradeable");
  contracts.erc998Upgradeable = await ERC998UpgradeableFactory.deploy("ERC998 LVL", "LVL998", royalty, baseTokenURI);
  await debug(contracts);

  // const erc998RandomFactory = await ethers.getContractFactory("ERC998RandomGemunion");
  const erc998RandomFactory = await ethers.getContractFactory("ERC998RandomBesu");
  // const erc998RandomFactory = await ethers.getContractFactory("ERC998Random");
  const erc998RandomInstance = await erc998RandomFactory.deploy("ERC998 HERO", "RNG998", royalty, baseTokenURI);
  contracts.erc998Random = erc998RandomInstance;
  await debug(contracts);

  await debug(await linkInstance.transfer(contracts.erc998Random.address, linkAmountInEth), "linkInstance.transfer");

  await debug(
    await erc998RandomInstance.whiteListChild(contracts.erc721Random.address, 5),
    "erc998RandomInstance.whiteListChild",
  );

  const erc1155SimpleFactory = await ethers.getContractFactory("ERC1155Simple");
  contracts.erc1155Simple = await erc1155SimpleFactory.deploy(royalty, baseTokenURI);
  await debug(contracts);

  const erc1155InactiveFactory = await ethers.getContractFactory("ERC1155Simple");
  contracts.erc1155Inactive = await erc1155InactiveFactory.deploy(royalty, baseTokenURI);
  await debug(contracts);

  const erc1155NewFactory = await ethers.getContractFactory("ERC1155Simple");
  contracts.erc1155New = await erc1155NewFactory.deploy(royalty, baseTokenURI);
  await debug(contracts);

  const erc1155BlacklistFactory = await ethers.getContractFactory("ERC1155Blacklist");
  contracts.erc1155Blacklist = await erc1155BlacklistFactory.deploy(royalty, baseTokenURI);
  await debug(contracts);

  const linearVestingFactory = await ethers.getContractFactory("LinearVesting");
  contracts.vestingLinear = await linearVestingFactory.deploy(wallet, timestamp, 365 * 86400);
  await debug(contracts);

  const gradedVestingFactory = await ethers.getContractFactory("GradedVesting");
  contracts.vestingGraded = await gradedVestingFactory.deploy(wallet, timestamp, 365 * 86400);
  await debug(contracts);

  const cliffVestingFactory = await ethers.getContractFactory("CliffVesting");
  contracts.vestingCliff = await cliffVestingFactory.deploy(wallet, timestamp, 365 * 86400);
  await debug(contracts);

  const mysteryboxSimpleFactory = await ethers.getContractFactory("ERC721MysteryboxSimple");
  const mysteryboxSimpleInstance = await mysteryboxSimpleFactory.deploy("Mysterybox", "MB721", 100, baseTokenURI);
  contracts.erc721MysteryboxSimple = mysteryboxSimpleInstance;
  await debug(contracts);

  await debug(
    await contracts.contractManager.addFactory(mysteryboxSimpleInstance.address, MINTER_ROLE),
    "contractManager.addFactory",
  );

  const mysteryboxPausableFactory = await ethers.getContractFactory("ERC721MysteryboxPausable");
  const mysteryboxPausableInstance = await mysteryboxPausableFactory.deploy("Mysterybox", "MB-P721", 100, baseTokenURI);
  contracts.erc721MysteryboxPausable = mysteryboxPausableInstance;
  await debug(contracts);

  await debug(
    await contracts.contractManager.addFactory(mysteryboxPausableInstance.address, MINTER_ROLE),
    "contractManager.addFactory",
  );

  const mysteryboxBlacklistFactory = await ethers.getContractFactory("ERC721MysteryboxBlacklist");
  const mysteryboxBlacklistInstance = await mysteryboxBlacklistFactory.deploy(
    "Mysterybox",
    "MB-BL721",
    100,
    baseTokenURI,
  );
  contracts.erc721MysteryboxBlacklist = mysteryboxBlacklistInstance;
  await debug(contracts);

  await debug(
    await contracts.contractManager.addFactory(mysteryboxBlacklistInstance.address, MINTER_ROLE),
    "contractManager.addFactory",
  );

  const stakingFactory = await ethers.getContractFactory("Staking");
  const stakingInstance = await stakingFactory.deploy(10);
  contracts.staking = stakingInstance;
  await debug(contracts);

  await debug(
    await stakingInstance.setRules([
      {
        externalId: 11, // NATIVE > NATIVE
        deposit: {
          tokenType: 0,
          token: constants.AddressZero,
          tokenId: 0,
          amount: constants.WeiPerEther,
        },
        reward: {
          tokenType: 0,
          token: constants.AddressZero,
          tokenId: 0,
          amount: constants.WeiPerEther.div(100).mul(5), // 5%
        },
        content: [],
        period: 30 * 84600,
        penalty: 1,
        recurrent: false,
        active: true,
      },
    ]),
    "stakingInstance.setRules",
  );

  await debug(
    await stakingInstance.setRules([
      {
        externalId: 23, // ERC20 > ERC721
        deposit: {
          tokenType: 1,
          token: contracts.erc20Simple.address,
          tokenId: 0,
          amount: constants.WeiPerEther,
        },
        reward: {
          tokenType: 2,
          token: contracts.erc721Random.address,
          tokenId: 306001,
          amount: 1,
        },
        content: [],
        period: 30 * 84600,
        penalty: 1,
        recurrent: false,
        active: true,
      },
    ]),
    "takingInstance.setRules",
  );

  await debug(
    await stakingInstance.setRules([
      {
        externalId: 45, // ERC998 > ERC1155
        deposit: {
          tokenType: 3,
          token: contracts.erc998Random.address,
          tokenId: 0,
          amount: 1,
        },
        reward: {
          tokenType: 2,
          token: contracts.erc721MysteryboxSimple.address,
          tokenId: 601001,
          amount: 1,
        },
        content: [
          {
            tokenType: 2,
            token: contracts.erc721Random.address,
            tokenId: 306001,
            amount: 1,
          },
        ],
        period: 1 * 84600,
        penalty: 0,
        recurrent: true,
        active: true,
      },
    ]),
    "takingInstance.setRules",
  );

  await debug(
    await contracts.contractManager.addFactory(stakingInstance.address, MINTER_ROLE),
    "contractManager.addFactory",
  );

  const erc721LotteryFactory = await ethers.getContractFactory("ERC721Ticket");
  // contracts.erc721Lottery = erc721LotteryFactory.attach("0x2f730b7fb875732c59f2fba22375b7f37047a93f");
  contracts.erc721Lottery = await erc721LotteryFactory.deploy("LOTTERY TICKET", "LOTT721", royalty, baseTokenURI);
  await debug(contracts);

  // const lotteryFactory = await ethers.getContractFactory("Lottery");
  const lotteryFactory = await ethers.getContractFactory("LotteryRandomBesu");
  // const lotteryFactory = await ethers.getContractFactory("LotteryRandomGemunion");
  // contracts.lottery = lotteryFactory.attach("0xb1e61fd987912106301e5743c74408b73841d334");

  contracts.lottery = await lotteryFactory.deploy(
    "Lottery",
    contracts.erc721Lottery.address,
    contracts.erc20Simple.address,
  );
  await debug(contracts);

  await debug(await linkInstance.transfer(contracts.lottery.address, linkAmountInEth), "linkInstance.transfer");

  await debug(await contracts.erc721Lottery.grantRole(MINTER_ROLE, contracts.lottery.address), "grantRole");

  const usdtFactory = await ethers.getContractFactory("TetherToken");
  contracts.usdt = await usdtFactory.deploy(100000000000, "Tether USD", "USDT", 6);
  await debug(contracts);

  const waitlistFactory = await ethers.getContractFactory("Waitlist");
  contracts.waitlist = await waitlistFactory.deploy();
  await debug(contracts);

  const root = "0xb026b326e62eb342a39b9d932ef7e2f7e40f917cee1994e2412ea6f65902a13a";
  const items = [
    {
      tokenType: 2,
      token: contracts.erc721Simple.address,
      tokenId: 301002,
      amount: "0",
    },
  ];

  await debug(await contracts.waitlist.setReward(root, items, 2), "waitlist.setReward");

  const erc721WrapFactory = await ethers.getContractFactory("ERC721TokenWrapper");
  contracts.erc721Wrapper = await erc721WrapFactory.deploy("WRAPPER", "WRAP", royalty, baseTokenURI);
  await debug(contracts);

  // TODO add pyramid deploy

  // GRANT ROLES
  await grantRoles(
    [
      contracts.erc1155Blacklist.address,
      contracts.erc1155New.address,
      contracts.erc1155Simple.address,
      contracts.erc721New.address,
      contracts.erc721Random.address,
      contracts.erc721Simple.address,
      contracts.erc721Upgradeable.address,
      contracts.erc998Blacklist.address,
      contracts.erc998New.address,
      contracts.erc998Random.address,
      contracts.erc998Simple.address,
      contracts.erc998Upgradeable.address,
      mysteryboxBlacklistInstance.address,
      mysteryboxPausableInstance.address,
      mysteryboxSimpleInstance.address,
      contracts.erc721Lottery.address,
    ],
    [
      contracts.erc721Wrapper.address,
      contracts.exchange.address,
      contracts.staking.address,
      contracts.waitlist.address,
      mysteryboxBlacklistInstance.address,
      mysteryboxPausableInstance.address,
      mysteryboxSimpleInstance.address,
      contracts.lottery.address,
    ],
    [MINTER_ROLE],
  );
}

main()
  .then(() => {
    Object.entries(contracts).map(([key, value]) =>
      console.info(`${camelToSnakeCase(key).toUpperCase()}_ADDR=${value.address.toLowerCase()}`),
    );
    process.exit(0);
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
