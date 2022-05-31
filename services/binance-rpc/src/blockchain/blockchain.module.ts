// import { Module, Logger, forwardRef } from "@nestjs/common";
// import { ConfigModule, ConfigService } from "@nestjs/config";
//
// import { EthersContractModule, IModuleOptions } from "@gemunion/nestjs-ethers";
//
// import {
//   ContractManagerEventType,
//   Erc1155MarketplaceEventType,
//   Erc1155RecipeEventType,
//   Erc1155TokenEventType,
//   Erc20TokenEventType,
//   Erc721MarketplaceEventType,
//   Erc721RecipeEventType,
//   Erc721TokenEventType,
//   ContractType,
// } from "@framework/types";
//
// // import { ContractType } from "../common/interfaces";
// import { ContractManagerModule } from "../contract-manager/contract-manager.module";
// import { ContractManagerService } from "../contract-manager/contract-manager.service";
//
// import { BlockchainService } from "./blockchain.service";
// // system contracts
// import ContractManagerSol from "@framework/binance-contracts/artifacts/contracts/ContractManager/ContractManager.sol/ContractManager.json";
// import ERC721MarketplaceSol from "@framework/binance-contracts/artifacts/contracts/Marketplace/ERC721Marketplace.sol/ERC721Marketplace.json";
// import ERC721AirdropSol from "@framework/binance-contracts/artifacts/contracts/ERC721/ERC721Airdrop.sol/ERC721Airdrop.json";
// import ERC721DropboxSol from "@framework/binance-contracts/artifacts/contracts/ERC721/ERC721Dropbox.sol/ERC721Dropbox.json";
// import ERC721ERC1155CraftSol from "@framework/binance-contracts/artifacts/contracts/Craft/ERC1155ERC721Craft.sol/ERC1155ERC721Craft.json";
// import ERC1155MarketplaceSol from "@framework/binance-contracts/artifacts/contracts/Marketplace/ERC1155Marketplace.sol/ERC1155Marketplace.json";
// import ERC1155ERC1155CraftSol from "@framework/binance-contracts/artifacts/contracts/Craft/ERC1155ERC1155Craft.sol/ERC1155ERC1155Craft.json";
//
// // custom contracts
// import ERC20SimpleSol from "@framework/binance-contracts/artifacts/contracts/ERC20/ERC20Simple.sol/ERC20Simple.json";
// // import ERC20Blist from "@framework/binance-contracts/artifacts/contracts/ERC20/ERC20BlackList.sol/ERC20BlackList.json";
// import ERC1155SimpleSol from "@framework/binance-contracts/artifacts/contracts/ERC1155/ERC1155Simple.sol/ERC1155Simple.json";
// import { ERC721Abi } from "./interfaces";
// // import ERC721Graded from "@framework/binance-contracts/artifacts/contracts/ERC721/ERC721Graded.sol/ERC721Graded.json";
// // import ERC721Random from "@framework/binance-contracts/artifacts/contracts/ERC721/ERC721Random.sol/ERC721Random.json";
// // import ERC721Simple from "@framework/binance-contracts/artifacts/contracts/ERC721/ERC721Simple.sol/ERC721Simple.json";
//
// @Module({
//   imports: [
//     ConfigModule,
//     forwardRef(() => ContractManagerModule),
//     // ContractManager
//     EthersContractModule.forRootAsync(EthersContractModule, {
//       imports: [ConfigModule, ContractManagerModule],
//       inject: [ConfigService, ContractManagerService],
//       useFactory: async (
//         configService: ConfigService,
//         contractManagerService: ContractManagerService,
//       ): Promise<IModuleOptions> => {
//         const contractManagerAddr = configService.get<string>("CONTRACT_MANAGER_ADDR", "");
//         const fromBlock =
//           (await contractManagerService.getLastBlock(contractManagerAddr)) ||
//           ~~configService.get<string>("STARTING_BLOCK", "0");
//         return {
//           contract: {
//             contractType: ContractType.CONTRACT_MANAGER,
//             contractAddress: [contractManagerAddr],
//             contractInterface: ContractManagerSol.abi,
//             // prettier-ignore
//             eventNames: [
//               ContractManagerEventType.ERC20VestingDeployed,
//               ContractManagerEventType.ERC20TokenDeployed,
//               ContractManagerEventType.ERC721TokenDeployed,
//               ContractManagerEventType.ERC1155TokenDeployed,
//             ],
//           },
//           block: {
//             startBlock: fromBlock,
//           },
//         };
//       },
//     }),
//     // // ERC721Marketplace
//     // EthersContractModule.forRootAsync(EthersContractModule, {
//     //   imports: [ConfigModule, ContractManagerModule],
//     //   inject: [ConfigService, ContractManagerService],
//     //   useFactory: async (
//     //     configService: ConfigService,
//     //     contractManagerService: ContractManagerService,
//     //   ): Promise<IModuleOptions> => {
//     //     const erc721MarketplaceAddr = configService.get<string>("ERC721_MARKETPLACE_ADDR", "");
//     //     const fromBlock =
//     //       (await contractManagerService.getLastBlock(erc721MarketplaceAddr)) ||
//     //       ~~configService.get<string>("STARTING_BLOCK", "0");
//     //     return {
//     //       contract: {
//     //         contractType: ContractType.ERC721_MARKETPLACE,
//     //         contractAddress: [erc721MarketplaceAddr],
//     //         contractInterface: ERC721MarketplaceSol.abi,
//     //         // prettier-ignore
//     //         eventNames: [
//     //           Erc721MarketplaceEventType.Redeem,
//     //           Erc721MarketplaceEventType.RedeemDropbox,
//     //         ],
//     //       },
//     //       block: {
//     //         startBlock: fromBlock,
//     //       },
//     //     };
//     //   },
//     // }),
//     // // ERC721Airdrop
//     // EthersContractModule.forRootAsync(EthersContractModule, {
//     //   imports: [ConfigModule, ContractManagerModule],
//     //   inject: [ConfigService, ContractManagerService],
//     //   useFactory: async (
//     //     configService: ConfigService,
//     //     contractManagerService: ContractManagerService,
//     //   ): Promise<IModuleOptions> => {
//     //     const erc721AirdropAddr = configService.get<string>("ERC721_AIRDROP_ADDR", "");
//     //     const fromBlock =
//     //       (await contractManagerService.getLastBlock(erc721AirdropAddr)) ||
//     //       ~~configService.get<string>("STARTING_BLOCK", "0");
//     //     return {
//     //       contract: {
//     //         contractType: ContractType.ERC721_AIRDROP,
//     //         contractAddress: [erc721AirdropAddr],
//     //         contractInterface: ERC721AirdropSol.abi,
//     //         // prettier-ignore
//     //         eventNames: [
//     //           Erc721TokenEventType.Transfer,
//     //           Erc721TokenEventType.Approval,
//     //           Erc721TokenEventType.ApprovalForAll,
//     //           Erc721TokenEventType.TokenRoyaltyInfo,
//     //           Erc721TokenEventType.DefaultRoyaltyInfo,
//     //           Erc721TokenEventType.RedeemAirdrop,
//     //           Erc721TokenEventType.UnpackAirdrop,
//     //         ],
//     //       },
//     //       block: {
//     //         startBlock: fromBlock,
//     //       },
//     //     };
//     //   },
//     // }),
//     // // ERC721Dropbox
//     // EthersContractModule.forRootAsync(EthersContractModule, {
//     //   imports: [ConfigModule, ContractManagerModule],
//     //   inject: [ConfigService, ContractManagerService],
//     //   useFactory: async (
//     //     configService: ConfigService,
//     //     contractManagerService: ContractManagerService,
//     //   ): Promise<IModuleOptions> => {
//     //     const erc721DropboxAddr = configService.get<string>("ERC721_DROPBOX_ADDR", "");
//     //     const fromBlock =
//     //       (await contractManagerService.getLastBlock(erc721DropboxAddr)) ||
//     //       ~~configService.get<string>("STARTING_BLOCK", "0");
//     //     return {
//     //       contract: {
//     //         contractType: ContractType.ERC721_DROPBOX,
//     //         contractAddress: [erc721DropboxAddr],
//     //         contractInterface: ERC721DropboxSol.abi,
//     //         // prettier-ignore
//     //         eventNames: [
//     //           Erc721TokenEventType.Transfer,
//     //           Erc721TokenEventType.Approval,
//     //           Erc721TokenEventType.ApprovalForAll,
//     //           Erc721TokenEventType.TokenRoyaltyInfo,
//     //           Erc721TokenEventType.DefaultRoyaltyInfo,
//     //           Erc721TokenEventType.UnpackDropbox,
//     //         ],
//     //       },
//     //       block: {
//     //         startBlock: fromBlock,
//     //       },
//     //     };
//     //   },
//     // }),
//     // // ERC721Craft
//     // EthersContractModule.forRootAsync(EthersContractModule, {
//     //   imports: [ConfigModule, ContractManagerModule],
//     //   inject: [ConfigService, ContractManagerService],
//     //   useFactory: async (
//     //     configService: ConfigService,
//     //     contractManagerService: ContractManagerService,
//     //   ): Promise<IModuleOptions> => {
//     //     const erc721CraftAddr = configService.get<string>("ERC721_CRAFT_ADDR", "");
//     //     const fromBlock =
//     //       (await contractManagerService.getLastBlock(erc721CraftAddr)) ||
//     //       ~~configService.get<string>("STARTING_BLOCK", "0");
//     //     return {
//     //       contract: {
//     //         contractType: ContractType.ERC721_CRAFT,
//     //         contractAddress: [erc721CraftAddr],
//     //         contractInterface: ERC721ERC1155CraftSol.abi,
//     //         // prettier-ignore
//     //         eventNames: [
//     //           Erc721RecipeEventType.RecipeCreated,
//     //           Erc721RecipeEventType.RecipeUpdated,
//     //           Erc721RecipeEventType.RecipeCrafted,
//     //         ],
//     //       },
//     //       block: {
//     //         startBlock: fromBlock,
//     //       },
//     //     };
//     //   },
//     // }),
//     // // ERC1155Marketplace
//     // EthersContractModule.forRootAsync(EthersContractModule, {
//     //   imports: [ConfigModule, ContractManagerModule],
//     //   inject: [ConfigService, ContractManagerService],
//     //   useFactory: async (
//     //     configService: ConfigService,
//     //     contractManagerService: ContractManagerService,
//     //   ): Promise<IModuleOptions> => {
//     //     const erc1155MarketplaceAddr = configService.get<string>("ERC1155_MARKETPLACE_ADDR", "");
//     //     const fromBlock =
//     //       (await contractManagerService.getLastBlock(erc1155MarketplaceAddr)) ||
//     //       ~~configService.get<string>("STARTING_BLOCK", "0");
//     //     return {
//     //       contract: {
//     //         contractType: ContractType.ERC1155_MARKETPLACE,
//     //         contractAddress: [erc1155MarketplaceAddr],
//     //         contractInterface: ERC1155MarketplaceSol.abi,
//     //         // prettier-ignore
//     //         eventNames: [
//     //           Erc1155MarketplaceEventType.Redeem,
//     //         ],
//     //       },
//     //       block: {
//     //         startBlock: fromBlock,
//     //       },
//     //     };
//     //   },
//     // }),
//     // // ERC1155Craft
//     // EthersContractModule.forRootAsync(EthersContractModule, {
//     //   imports: [ConfigModule, ContractManagerModule],
//     //   inject: [ConfigService, ContractManagerService],
//     //   useFactory: async (
//     //     configService: ConfigService,
//     //     contractManagerService: ContractManagerService,
//     //   ): Promise<IModuleOptions> => {
//     //     const erc1155CraftAddr = configService.get<string>("ERC1155_CRAFT_ADDR", "");
//     //     const fromBlock =
//     //       (await contractManagerService.getLastBlock(erc1155CraftAddr)) ||
//     //       ~~configService.get<string>("STARTING_BLOCK", "0");
//     //     return {
//     //       contract: {
//     //         contractType: ContractType.ERC1155_CRAFT,
//     //         contractAddress: [erc1155CraftAddr],
//     //         contractInterface: ERC1155ERC1155CraftSol.abi,
//     //         // prettier-ignore
//     //         eventNames: [
//     //           Erc1155RecipeEventType.RecipeCreated,
//     //           Erc1155RecipeEventType.RecipeUpdated,
//     //           Erc1155RecipeEventType.RecipeCrafted,
//     //         ],
//     //       },
//     //       block: {
//     //         startBlock: fromBlock,
//     //       },
//     //     };
//     //   },
//     // }),
//     // // Erc20 user contracts
//     // EthersContractModule.forRootAsync(EthersContractModule, {
//     //   imports: [ConfigModule, ContractManagerModule],
//     //   inject: [ConfigService, ContractManagerService],
//     //   useFactory: async (
//     //     configService: ConfigService,
//     //     contractManagerService: ContractManagerService,
//     //   ): Promise<IModuleOptions> => {
//     //     const erc20Contracts = await contractManagerService.findAllByType(ContractType.ERC20_CONTRACT);
//     //     return {
//     //       contract: {
//     //         contractType: ContractType.ERC20_CONTRACT,
//     //         contractAddress: erc20Contracts.address || [],
//     //         contractInterface: ERC20SimpleSol.abi,
//     //         // prettier-ignore
//     //         eventNames: [
//     //           Erc20TokenEventType.Approval,
//     //           Erc20TokenEventType.RoleGranted,
//     //           Erc20TokenEventType.RoleRevoked,
//     //           Erc20TokenEventType.Snapshot,
//     //           Erc20TokenEventType.Transfer,
//     //         ],
//     //       },
//     //       block: {
//     //         startBlock: erc20Contracts.fromBlock || ~~configService.get<string>("STARTING_BLOCK", "0"),
//     //       },
//     //     };
//     //   },
//     // }),
//     // // Erc1155 user contracts
//     // EthersContractModule.forRootAsync(EthersContractModule, {
//     //   imports: [ConfigModule, ContractManagerModule],
//     //   inject: [ConfigService, ContractManagerService],
//     //   useFactory: async (
//     //     configService: ConfigService,
//     //     contractManagerService: ContractManagerService,
//     //   ): Promise<IModuleOptions> => {
//     //     const erc1155Contracts = await contractManagerService.findAllByType(ContractType.ERC1155_COLLECTION);
//     //     return {
//     //       contract: {
//     //         contractType: ContractType.ERC1155_COLLECTION,
//     //         contractAddress: erc1155Contracts.address || [],
//     //         contractInterface: ERC1155SimpleSol.abi,
//     //         // prettier-ignore
//     //         eventNames: [
//     //           Erc1155TokenEventType.ApprovalForAll,
//     //           Erc1155TokenEventType.RoleGranted,
//     //           Erc1155TokenEventType.RoleRevoked,
//     //           Erc1155TokenEventType.TransferBatch,
//     //           Erc1155TokenEventType.TransferSingle,
//     //           Erc1155TokenEventType.URI,
//     //         ],
//     //       },
//     //       block: {
//     //         startBlock: erc1155Contracts.fromBlock || ~~configService.get<string>("STARTING_BLOCK", "0"),
//     //       },
//     //     };
//     //   },
//     // }),
//     // // Erc721 user contracts
//     // EthersContractModule.forRootAsync(EthersContractModule, {
//     //   imports: [ConfigModule, ContractManagerModule],
//     //   inject: [ConfigService, ContractManagerService],
//     //   useFactory: async (
//     //     configService: ConfigService,
//     //     contractManagerService: ContractManagerService,
//     //   ): Promise<IModuleOptions> => {
//     //     // console.log("ERC721FullAbi", ERC721FullAbi);
//     //     const erc721Contracts = await contractManagerService.findAllByType(ContractType.ERC721_COLLECTION);
//     //     return {
//     //       contract: {
//     //         contractType: ContractType.ERC721_COLLECTION,
//     //         contractAddress: erc721Contracts.address || [],
//     //         contractInterface: ERC721FullAbi,
//     //         // prettier-ignore
//     //         eventNames: [],
//     //       },
//     //       block: {
//     //         startBlock: erc721Contracts.fromBlock || ~~configService.get<string>("STARTING_BLOCK", "0"),
//     //       },
//     //     };
//     //   },
//     // }),
//   ],
//   providers: [BlockchainService, Logger],
//   exports: [BlockchainService],
// })
// export class BlockchainModule {}
