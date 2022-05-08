import { Module, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AbiItem } from "web3-utils";

import { Web3ContractModule, Web3ContractService } from "@gemunion/nestjs-web3";

import { ContractType } from "../common/interfaces";

import {
  Erc1155MarketplaceEventType,
  Erc1155RecipeEventType,
  Erc1155TokenEventType,
  Erc20TokenEventType,
  Erc20VestingEventType,
  Erc721AuctionEventType,
  Erc721MarketplaceEventType,
  Erc721TokenEventType,
} from "@framework/types";

import coin from "@framework/binance-contracts/artifacts/contracts/Coin/Coin.sol/Coin.json";
import vesting from "@framework/binance-contracts/artifacts/contracts/Vesting/VestingFactory.sol/VestingFactory.json";
import resources from "@framework/binance-contracts/artifacts/contracts/ERC1155/Resources.sol/Resources.json";
import items from "@framework/binance-contracts/artifacts/contracts/ERC721/Item.sol/Item.json";
import hero from "@framework/binance-contracts/artifacts/contracts/ERC721/Hero.sol/Hero.json";
import skill from "@framework/binance-contracts/artifacts/contracts/ERC721/Skill.sol/Skill.json";
import refinery from "@framework/binance-contracts/artifacts/contracts/Craft/CraftERC1155.sol/CraftERC1155.json";
import auctionERC721 from "@framework/binance-contracts/artifacts/contracts/Auction/AuctionERC721.sol/AuctionERC721.json";
import airdropERC721 from "@framework/binance-contracts/artifacts/contracts/Dropbox/AirdropERC721.sol/AirdropERC721.json";
import dropboxERC721 from "@framework/binance-contracts/artifacts/contracts/Dropbox/DropboxERC721.sol/DropboxERC721.json";
import marketplaceERC721 from "@framework/binance-contracts/artifacts/contracts/Marketplace/MarketplaceERC721.sol/MarketplaceERC721.json";
import marketplaceERC1155 from "@framework/binance-contracts/artifacts/contracts/Marketplace/MarketplaceERC1155.sol/MarketplaceERC1155.json";

@Module({
  imports: [ConfigModule, Web3ContractModule],
})
export class BlockchainModule implements OnModuleInit, OnModuleDestroy {
  constructor(
    private readonly web3ContractService: Web3ContractService,
    private readonly configService: ConfigService,
  ) {}

  public async onModuleInit(): Promise<void> {
    const coinAddr = this.configService.get<string>("ERC20_COIN", "");
    const vestingAddr = this.configService.get<string>("ERC20_VESTING", "");
    const itemsAddr = this.configService.get<string>("ERC721_ITEM_ADDR", "");
    const heroAddr = this.configService.get<string>("ERC721_HERO_ADDR", "");
    const skillAddr = this.configService.get<string>("ERC721_SKILL_ADDR", "");
    const resourcesAddr = this.configService.get<string>("RESOURCES_ERC1155_ADDR", "");
    const refineryAddr = this.configService.get<string>("ERC1155_CRAFT_ADDR", "");
    const itemAuctionAddr = this.configService.get<string>("ERC721_AUCTION_ADDR", "");
    const airDropboxAddr = this.configService.get<string>("ERC721_AIRDROP_ADDR", "");
    const itemDropboxAddr = this.configService.get<string>("ERC721_DROPBOX_ADDR", "");
    const itemMarketplaceAddr = this.configService.get<string>("ERC721_MARKETPLACE_ADDR", "");
    const resourcesMarketplaceAddr = this.configService.get<string>("MARKETPLACE_ERC1155_ADDR", "");

    await this.web3ContractService.listen([
      {
        contractName: ContractType.ERC20_COIN,
        contractAddress: coinAddr,
        contractInterface: coin.abi as Array<AbiItem>,
        // prettier-ignore
        eventNames: [
          Erc20TokenEventType.Transfer,
          Erc20TokenEventType.Approval,
        ],
      },
      {
        contractName: ContractType.ERC20_VESTING,
        contractAddress: vestingAddr,
        contractInterface: vesting.abi as Array<AbiItem>,
        // prettier-ignore
        eventNames: [
          Erc20VestingEventType.FlatVestingCreated,
        ],
      },
      {
        contractName: ContractType.ERC721_AIRDROP,
        contractAddress: airDropboxAddr,
        contractInterface: airdropERC721.abi as Array<AbiItem>,
        // prettier-ignore
        eventNames: [
          Erc721TokenEventType.Transfer,
          Erc721TokenEventType.Approval,
          Erc721TokenEventType.ApprovalForAll,
          Erc721TokenEventType.TokenRoyaltyInfo,
          Erc721TokenEventType.DefaultRoyaltyInfo,
          Erc721TokenEventType.RedeemAirdrop,
          Erc721TokenEventType.UnpackAirdrop,
        ],
      },
      {
        contractName: ContractType.ERC721_DROPBOX,
        contractAddress: itemDropboxAddr,
        contractInterface: dropboxERC721.abi as Array<AbiItem>,
        // prettier-ignore
        eventNames: [
          Erc721TokenEventType.Transfer,
          Erc721TokenEventType.Approval,
          Erc721TokenEventType.ApprovalForAll,
          Erc721TokenEventType.TokenRoyaltyInfo,
          Erc721TokenEventType.DefaultRoyaltyInfo,
          Erc721TokenEventType.UnpackDropbox,
        ],
      },
      {
        contractName: ContractType.ERC721_ITEMS,
        contractAddress: itemsAddr,
        contractInterface: items.abi as Array<AbiItem>,
        // prettier-ignore
        eventNames: [
          Erc721TokenEventType.Transfer,
          Erc721TokenEventType.Approval,
          Erc721TokenEventType.ApprovalForAll,
          Erc721TokenEventType.MintRandom,
          Erc721TokenEventType.TokenRoyaltyInfo,
          Erc721TokenEventType.DefaultRoyaltyInfo,
        ],
      },
      {
        contractName: ContractType.ERC1155_RESOURCES,
        contractAddress: resourcesAddr,
        contractInterface: resources.abi as Array<AbiItem>,
        // prettier-ignore
        eventNames: [
          Erc1155TokenEventType.TransferSingle,
          Erc1155TokenEventType.TransferBatch,
          Erc1155TokenEventType.ApprovalForAll,
          Erc1155TokenEventType.URI,
        ],
      },
      {
        contractName: ContractType.ERC721_HERO,
        contractAddress: heroAddr,
        contractInterface: hero.abi as Array<AbiItem>,
        // prettier-ignore
        eventNames: [
          Erc721TokenEventType.Transfer,
          Erc721TokenEventType.Approval,
          Erc721TokenEventType.ApprovalForAll,
          Erc721TokenEventType.MintRandom,
          Erc721TokenEventType.TokenRoyaltyInfo,
          Erc721TokenEventType.DefaultRoyaltyInfo,
        ],
      },
      {
        contractName: ContractType.ERC721_SKILL,
        contractAddress: skillAddr,
        contractInterface: skill.abi as Array<AbiItem>,
        // prettier-ignore
        eventNames: [
          Erc721TokenEventType.Transfer,
          Erc721TokenEventType.Approval,
          Erc721TokenEventType.ApprovalForAll,
          Erc721TokenEventType.TokenRoyaltyInfo,
          Erc721TokenEventType.DefaultRoyaltyInfo,
        ],
      },
      {
        contractName: ContractType.ERC1155_CRAFT,
        contractAddress: refineryAddr,
        contractInterface: refinery.abi as Array<AbiItem>,
        // prettier-ignore
        eventNames: [
          Erc1155RecipeEventType.RecipeCreated,
          Erc1155RecipeEventType.RecipeUpdated,
          Erc1155RecipeEventType.RecipeCrafted,
        ],
      },
      {
        contractName: ContractType.ERC721_AUCTION,
        contractAddress: itemAuctionAddr,
        contractInterface: auctionERC721.abi as Array<AbiItem>,
        // prettier-ignore
        eventNames: [
          Erc721AuctionEventType.AuctionStart,
          Erc721AuctionEventType.AuctionBid,
          Erc721AuctionEventType.AuctionFinish,
        ],
      },
      {
        contractName: ContractType.ERC721_MARKETPLACE,
        contractAddress: itemMarketplaceAddr,
        contractInterface: marketplaceERC721.abi as Array<AbiItem>,
        // prettier-ignore
        eventNames: [
          Erc721MarketplaceEventType.Redeem,
          Erc721MarketplaceEventType.RedeemDropbox,
        ],
      },
      {
        contractName: ContractType.ERC1155_MARKETPLACE,
        contractAddress: resourcesMarketplaceAddr,
        contractInterface: marketplaceERC1155.abi as Array<AbiItem>,
        // prettier-ignore
        eventNames: [
          Erc1155MarketplaceEventType.Redeem,
        ],
      },
    ]);
  }

  public async onModuleDestroy(): Promise<void> {
    await this.web3ContractService.destroy();
  }
}
