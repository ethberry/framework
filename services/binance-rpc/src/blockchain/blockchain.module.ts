import { Module, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AbiItem } from "web3-utils";

import { Web3ContractModule, Web3ContractService } from "@gemunion/nestjs-web3";

import { ContractType } from "../common/interfaces";

import {
  ContractManagerEventType,
  Erc1155MarketplaceEventType,
  Erc1155RecipeEventType,
  Erc1155TokenEventType,
  Erc20TokenEventType,
  Erc721AuctionEventType,
  Erc721MarketplaceEventType,
  Erc721RecipeEventType,
  Erc721TokenEventType,
} from "@framework/types";

import ERC20Simple from "@framework/binance-contracts/artifacts/contracts/ERC20/ERC20Simple.sol/ERC20Simple.json";
import ERC20Blist from "@framework/binance-contracts/artifacts/contracts/ERC20/ERC20BlackList.sol/ERC20BlackList.json";
import ContractManager from "@framework/binance-contracts/artifacts/contracts/ContractManager/ContractManager.sol/ContractManager.json";
import ERC1155Simple from "@framework/binance-contracts/artifacts/contracts/ERC1155/ERC1155Simple.sol/ERC1155Simple.json";
import ERC721Graded from "@framework/binance-contracts/artifacts/contracts/ERC721/ERC721Graded.sol/ERC721Graded.json";
import ERC721Random from "@framework/binance-contracts/artifacts/contracts/ERC721/ERC721Random.sol/ERC721Random.json";
// import ERC721Simple from "@framework/binance-contracts/artifacts/contracts/ERC721/ERC721Simple.sol/ERC721Simple.json";
import ERC721Airdrop from "@framework/binance-contracts/artifacts/contracts/ERC721/ERC721Airdrop.sol/ERC721Airdrop.json";
import ERC721Dropbox from "@framework/binance-contracts/artifacts/contracts/ERC721/ERC721Dropbox.sol/ERC721Dropbox.json";
import craft721 from "@framework/binance-contracts/artifacts/contracts/Craft/ERC1155ERC721Craft.sol/ERC1155ERC721Craft.json";
import ERC1155ERC1155Craft from "@framework/binance-contracts/artifacts/contracts/Craft/ERC1155ERC1155Craft.sol/ERC1155ERC1155Craft.json";
import auctionERC721 from "@framework/binance-contracts/artifacts/contracts/Auction/AuctionERC721.sol/AuctionERC721.json";
import ERC721Marketplace from "@framework/binance-contracts/artifacts/contracts/Marketplace/ERC721Marketplace.sol/ERC721Marketplace.json";
import ERC1155Marketplace from "@framework/binance-contracts/artifacts/contracts/Marketplace/ERC1155Marketplace.sol/ERC1155Marketplace.json";

@Module({
  imports: [ConfigModule, Web3ContractModule],
})
export class BlockchainModule implements OnModuleInit, OnModuleDestroy {
  constructor(
    private readonly web3ContractService: Web3ContractService,
    private readonly configService: ConfigService,
  ) {}

  public async onModuleInit(): Promise<void> {
    const contractManagerAddr = this.configService.get<string>("CONTRACT_MANAGER_ADDR", "");
    const coinAddr = this.configService.get<string>("ERC20_COIN_ADDR", "");
    const coiblAddr = this.configService.get<string>("ERC20_COIN_BL_ADDR", "");
    const itemsAddr = this.configService.get<string>("ERC721_ITEM_ADDR", "");
    const heroAddr = this.configService.get<string>("ERC721_HERO_ADDR", "");
    const skillAddr = this.configService.get<string>("ERC721_SKILL_ADDR", "");
    const itemAuctionAddr = this.configService.get<string>("ERC721_AUCTION_ADDR", "");
    const airDropboxAddr = this.configService.get<string>("ERC721_AIRDROP_ADDR", "");
    const itemDropboxAddr = this.configService.get<string>("ERC721_DROPBOX_ADDR", "");
    const itemMarketplaceAddr = this.configService.get<string>("ERC721_MARKETPLACE_ADDR", "");
    const resourcesAddr = this.configService.get<string>("ERC1155_RESOURCES_ADDR", "");
    const craft721Addr = this.configService.get<string>("ERC721_CRAFT_ADDR", "");
    const refineryAddr = this.configService.get<string>("ERC1155_CRAFT_ADDR", "");
    const resourcesMarketplaceAddr = this.configService.get<string>("ERC1155_MARKETPLACE_ADDR", "");

    await this.web3ContractService.listen([
      {
        contractName: ContractType.CONTRACT_MANAGER,
        contractAddress: contractManagerAddr,
        contractInterface: ContractManager.abi as Array<AbiItem>,
        // prettier-ignore
        eventNames: [
          ContractManagerEventType.ERC20VestingDeployed,
          ContractManagerEventType.ERC20TokenDeployed,
          ContractManagerEventType.ERC721TokenDeployed,
          ContractManagerEventType.ERC1155TokenDeployed,
        ],
      },
      {
        contractName: ContractType.ERC20_COIN,
        contractAddress: coinAddr,
        contractInterface: ERC20Simple.abi as Array<AbiItem>,
        // prettier-ignore
        eventNames: [
          Erc20TokenEventType.Transfer,
          Erc20TokenEventType.Approval,
        ],
      },
      {
        contractName: ContractType.ERC20_COIN,
        contractAddress: coiblAddr,
        contractInterface: ERC20Blist.abi as Array<AbiItem>,
        // prettier-ignore
        eventNames: [
          Erc20TokenEventType.Transfer,
          Erc20TokenEventType.Approval,
        ],
      },
      {
        contractName: ContractType.ERC721_AIRDROP,
        contractAddress: airDropboxAddr,
        contractInterface: ERC721Airdrop.abi as Array<AbiItem>,
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
        contractInterface: ERC721Dropbox.abi as Array<AbiItem>,
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
        contractInterface: ERC721Random.abi as Array<AbiItem>,
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
        contractInterface: ERC1155Simple.abi as Array<AbiItem>,
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
        contractInterface: ERC721Random.abi as Array<AbiItem>,
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
        contractInterface: ERC721Graded.abi as Array<AbiItem>,
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
        contractInterface: ERC1155ERC1155Craft.abi as Array<AbiItem>,
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
        contractInterface: ERC721Marketplace.abi as Array<AbiItem>,
        // prettier-ignore
        eventNames: [
          Erc721MarketplaceEventType.Redeem,
          Erc721MarketplaceEventType.RedeemDropbox,
        ],
      },
      {
        contractName: ContractType.ERC721_CRAFT,
        contractAddress: craft721Addr,
        contractInterface: craft721.abi as Array<AbiItem>,
        // prettier-ignore
        eventNames: [
          Erc721RecipeEventType.RecipeCreated,
          Erc721RecipeEventType.RecipeUpdated,
          Erc721RecipeEventType.RecipeCrafted,
        ],
      },
      {
        contractName: ContractType.ERC1155_MARKETPLACE,
        contractAddress: resourcesMarketplaceAddr,
        contractInterface: ERC1155Marketplace.abi as Array<AbiItem>,
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
