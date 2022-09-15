import { ethers } from "hardhat";
import { Contract, constants } from "ethers";
import { wallet, wallets } from "@gemunion/constants";

import { blockAwait } from "../utils/blockAwait";
import { baseTokenURI, MINTER_ROLE, royalty, tokenName } from "../../test/constants";

const camelToSnakeCase = (str: string) => str.replace(/[A-Z]/g, letter => `_${letter}`);
const delay = 3; // block delay
const decimals = ethers.BigNumber.from(10).pow(18);
const linkAmountInWei = ethers.BigNumber.from("1000").mul(decimals);

interface IObj {
  address?: string;
  hash?: string;
}

const debug = async (obj: IObj | Record<string, Contract>, name?: string) => {
  if (obj && obj.hash) {
    console.info(`${name} tx: ${obj.hash}`);
    await blockAwait(delay);
  } else {
    console.info(`${Object.keys(obj).pop()} deployed`);
    await blockAwait(delay);
  }
};

const contracts: Record<string, Contract> = {};
const amount = constants.WeiPerEther.mul(1e6);
const timestamp = Math.ceil(Date.now() / 1000);

async function main() {
  const [owner] = await ethers.getSigners();
  // LINK & VRF
  // const linkFactory = await ethers.getContractFactory("LinkErc20");
  // const linkInstance = await linkFactory.deploy("LINK", "LINK");
  // contracts.link = linkInstance;
  // console.info(`LINK_ADDR=${contracts.link.address}`);
  // const vrfFactory = await ethers.getContractFactory("VRFCoordinatorMock");
  // contracts.vrf = await vrfFactory.deploy(contracts.link.address);
  // console.info(`VRF_ADDR=${contracts.vrf.address}`);
  // await debug(await linkInstance.mint(owner.address, linkAmountInWei.mul(100)), "LinkInstance.mint");
  //
  // console.log("afterDebug");
  // process.exit(0);
  // HAVE TO PASS VRF AND LINK ADDRESSES TO CHAINLINK-BESU CONCTRACT
  /*
    const cmFactory = await ethers.getContractFactory("ContractManager");
    contracts.contractManager = await cmFactory.deploy();
    await debug(contracts);
  
    const exchangeFactory = await ethers.getContractFactory("Exchange");
    const exchangeInstance = await exchangeFactory.deploy("Exchange");
    contracts.exchange = exchangeInstance;
    await debug(contracts);
  
    await debug(
      await contracts.contractManager.setFactories([exchangeInstance.address], [contracts.contractManager.address]),
      "contractManager.setFactories",
    );
  
    const erc20SimpleFactory = await ethers.getContractFactory("ERC20Simple");
    const erc20SimpleInstance = await erc20SimpleFactory.deploy("Space Credits", "GEM20", amount);
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
  
    const erc721RandomFactory = await ethers.getContractFactory("ERC721RandomBesu");
    contracts.erc721Random = await erc721RandomFactory.deploy("ERC721 WEAPON", "RNG721", royalty, baseTokenURI);
    await debug(contracts);
  
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
  
    const erc998RandomFactory = await ethers.getContractFactory("ERC998RandomBesu");
    const erc998RandomInstance = await erc998RandomFactory.deploy("ERC998 HERO", "RNG998", royalty, baseTokenURI);
    contracts.erc998Random = erc998RandomInstance;
    await debug(contracts);
  
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
  
    const stakingFactory = await ethers.getContractFactory("Staking");
    const stakingInstance = await stakingFactory.deploy(10);
    contracts.staking = stakingInstance;
    await debug(contracts);
  
    await debug(
      await stakingInstance.setRules([
        {
          externalId: 1, // NATIVE > NATIVE
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
          content: [
            {
              tokenType: 2,
              token: contracts.erc721Random.address,
              tokenId: 306001,
              amount: 1,
            },
          ],
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
          externalId: 8, // ERC20 > ERC721
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
          content: [
            {
              tokenType: 2,
              token: contracts.erc721Random.address,
              tokenId: 306001,
              amount: 1,
            },
          ],
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
          externalId: 19, // ERC998 > ERC1155
          deposit: {
            tokenType: 3,
            token: contracts.erc998Random.address,
            tokenId: 0,
            amount: 1,
          },
          reward: {
            tokenType: 4,
            token: contracts.erc1155Simple.address,
            tokenId: 501001,
            amount: 1000,
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
  
    const mysteryboxSimpleFactory = await ethers.getContractFactory("ERC721MysteryboxSimple");
    const mysteryboxSimpleInstance = await mysteryboxSimpleFactory.deploy("Mysterybox", "MB721", 100, baseTokenURI);
    contracts.erc721MysteryboxSimple = mysteryboxSimpleInstance;
    await debug(contracts);
  
    await debug(
      await contracts.erc721Simple.grantRole(MINTER_ROLE, mysteryboxSimpleInstance.address),
      "erc721Simple.grantRole",
    );
    await debug(
      await contracts.erc721Random.grantRole(MINTER_ROLE, mysteryboxSimpleInstance.address),
      "erc721Random.grantRole",
    );
    await debug(
      await contracts.erc998Random.grantRole(MINTER_ROLE, mysteryboxSimpleInstance.address),
      "erc998Random.grantRole",
    );
    await debug(
      await contracts.erc1155Simple.grantRole(MINTER_ROLE, mysteryboxSimpleInstance.address),
      "erc1155Simple.grantRole",
    );
  
    await debug(
      await mysteryboxSimpleInstance.grantRole(MINTER_ROLE, contracts.staking.address),
      "mysteryboxSimpleInstance.grantRole",
    );
    await debug(
      await mysteryboxSimpleInstance.grantRole(MINTER_ROLE, contracts.exchange.address),
      "mysteryboxSimpleInstance.grantRole",
    );
  
    await debug(
      await contracts.contractManager.addFactory(mysteryboxSimpleInstance.address, MINTER_ROLE),
      "contractManager.addFactory",
    );
  
    const mysteryboxPausableFactory = await ethers.getContractFactory("ERC721MysteryboxPausable");
    const mysteryboxPausableInstance = await mysteryboxPausableFactory.deploy("Mysterybox", "MB-P721", 100, baseTokenURI);
    contracts.erc721MysteryboxPausable = mysteryboxPausableInstance;
    await debug(contracts);
  
    await debug(
      await contracts.erc721Simple.grantRole(MINTER_ROLE, mysteryboxPausableInstance.address),
      "erc721Simple.grantRole",
    );
    await debug(
      await contracts.erc721Random.grantRole(MINTER_ROLE, mysteryboxPausableInstance.address),
      "erc721Random.grantRole",
    );
    await debug(
      await contracts.erc998Random.grantRole(MINTER_ROLE, mysteryboxPausableInstance.address),
      "erc998Random.grantRole",
    );
    await debug(
      await contracts.erc1155Simple.grantRole(MINTER_ROLE, mysteryboxPausableInstance.address),
      "erc1155Simple.grantRole",
    );
  
    await debug(
      await mysteryboxPausableInstance.grantRole(MINTER_ROLE, contracts.staking.address),
      "mysteryboxPausableInstance.grantRole",
    );
    await debug(
      await mysteryboxPausableInstance.grantRole(MINTER_ROLE, contracts.exchange.address),
      "mysteryboxPausableInstance.grantRole",
    );
  
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
      await contracts.erc721Simple.grantRole(MINTER_ROLE, mysteryboxBlacklistInstance.address),
      "erc721Simple.grantRole",
    );
  
    await debug(
      await contracts.erc721Simple.grantRole(MINTER_ROLE, contracts.exchange.address),
      "erc721Simple.grantRole",
    );
  
    await debug(
      await contracts.erc721Random.grantRole(MINTER_ROLE, mysteryboxBlacklistInstance.address),
      "erc721Random.grantRole",
    );
  
    await debug(
      await contracts.erc721Random.grantRole(MINTER_ROLE, contracts.exchange.address),
      "erc721Random.grantRole",
    );
  
    await debug(
      await contracts.erc998Random.grantRole(MINTER_ROLE, mysteryboxBlacklistInstance.address),
      "erc998Random.grantRole",
    );
  
    await debug(
      await contracts.erc998Random.grantRole(MINTER_ROLE, contracts.exchange.address),
      "erc998Random.grantRole",
    );
  
    await debug(
      await contracts.erc1155Simple.grantRole(MINTER_ROLE, mysteryboxBlacklistInstance.address),
      "erc1155Simple.grantRole",
    );
  
    await debug(
      await contracts.erc1155Simple.grantRole(MINTER_ROLE, contracts.exchange.address),
      "erc1155Simple.grantRole",
    );
  
    await debug(
      await mysteryboxBlacklistInstance.grantRole(MINTER_ROLE, contracts.staking.address),
      "mysteryboxBlacklistInstance.grantRole",
    );
    await debug(
      await mysteryboxBlacklistInstance.grantRole(MINTER_ROLE, contracts.exchange.address),
      "mysteryboxBlacklistInstance.grantRole",
    );
  
    await debug(
      await contracts.contractManager.addFactory(mysteryboxBlacklistInstance.address, MINTER_ROLE),
      "contractManager.addFactory",
    );
  
    const erc721LotteryFactory = await ethers.getContractFactory("ERC721Ticket");
    contracts.erc721Lottery = await erc721LotteryFactory.deploy("LOTTERY TICKET", "LOTT721", royalty, baseTokenURI);
    await debug(contracts);
  
    const lotteryFactory = await ethers.getContractFactory("Lottery");
    contracts.lottery = await lotteryFactory.deploy(
      tokenName,
      contracts.erc721Lottery.address,
      contracts.erc20Simple.address,
    );
    await debug(contracts);
  
    const usdtFactory = await ethers.getContractFactory("TetherToken");
    contracts.usdt = await usdtFactory.deploy(100000000000, "Tether USD", "USDT", 6);
    await debug(contracts);
  */
  const waitlistFactory = await ethers.getContractFactory("Waitlist");
  contracts.waitlist = await waitlistFactory.deploy();
  // await blockAwait();
  //
  // const proof = "0x0d8c4b1f3b24d4558a4957f19aec0e635de5990da009d2850fb69af9d3debeb4";
  // const items = [
  //   {
  //     tokenType: 2,
  //     token: "0x5c41079f959127be3b74e4e5cdbc4b5114f2df91",
  //     tokenId: 301002,
  //     amount: "0",
  //   },
  // ];
  //
  // const tx = await contracts.waitlist.setReward(proof, items, 0);
  // console.log("tx", tx.hash);
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
