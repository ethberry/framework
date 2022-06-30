import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

import { ns } from "@framework/constants";
import {
  createDomainUint256,
  createLanguageEnum,
  createSchema,
  createTokenTypes,
  installExtensionUUID
} from "@gemunion/nest-js-module-typeorm-helpers";

import { UserEntity } from "./user/user.entity";
import { OtpEntity } from "./otp/otp.entity";
import { SettingsEntity } from "./settings/settings.entity";
import { ContractManagerEntity } from "./blockchain/contract-manager/contract-manager.entity";
import { UniContractEntity } from "./blockchain/uni-token/uni-contract/uni-contract.entity";
import { AssetEntity } from "./blockchain/asset/asset.entity";
import { UniTemplateEntity } from "./blockchain/uni-token/uni-template/uni-template.entity";
import { UniTokenEntity } from "./blockchain/uni-token/uni-token/uni-token.entity";
import { AssetComponentEntity } from "./blockchain/asset/asset-component.entity";
import { AccessControlEntity } from "./blockchain/access-control/access-control.entity";
import { AccessListEntity } from "./blockchain/access-list/access-list.entity";
import { AirdropEntity } from "./mechanics/airdrop/airdrop.entity";
import { DropboxEntity } from "./mechanics/dropbox/dropbox.entity";
import { StakesEntity } from "./mechanics/staking/stakes/stakes.entity";
import { ExchangeEntity } from "./mechanics/exchange/exchange.entity";
import { StakingRulesEntity } from "./mechanics/staking/staking-rules/staking-rules.entity";
import { StakingHistoryEntity } from "./mechanics/staking/staking-history/staking-history.entity";
import { PageEntity } from "./page/page.entity";

import { CreateUserTable1563804000030 } from "./migrations/1563804000030-create-user-table";
import { SeedUser1563804000040 } from "./migrations/1563804000040-seed-user";
import { CreateOtpTable1563804000060 } from "./migrations/1563804000060-create-otp-table";

import { CreateAsset1563804000100 } from "./migrations/1563804000100-create-asset";

import { CreateUniContract1563804000110 } from "./migrations/1563804000110-create-uni-contract";
import { SeedUniContractErc20At1563804000120 } from "./migrations/1563804000120-seed-uni-contract-erc20";
import { SeedUniContractErc721At1563804000130 } from "./migrations/1563804000130-seed-uni-contract-erc721";
import { SeedUniContractErc998At1563804000140 } from "./migrations/1563804000140-seed-uni-contract-erc998";
import { SeedUniContractErc1155At1563804000150 } from "./migrations/1563804000150-seed-uni-contract-erc1155";

import { CreateUniTemplate1563804000210 } from "./migrations/1563804000210-create-uni-template";
import { SeedUniTemplateErc20At1563804000220 } from "./migrations/1563804000220-seed-template-erc20";
import { SeedUniTemplateErc721At1563804000230 } from "./migrations/1563804000230-seed-template-erc721";
import { SeedUniTemplateErc998At1563804000240 } from "./migrations/1563804000240-seed-template-erc998";
import { SeedUniTemplateErc1155At1563804000250 } from "./migrations/1563804000250-seed-template-erc1155";

import { CreateUniToken1563804000310 } from "./migrations/1563804000310-create-uni-token";
import { SeedUniTokenErc1155At1563804000350 } from "./migrations/1563804000350-seed-token-erc1155";

import { CreateUniBalanceTable1563804000410 } from "./migrations/1563804000410-create-uni-balance";
import { SeedUniBalanceErc1155At1563804020410 } from "./migrations/1563804000410-seed-uni-balance-erc1155";

import { CreateAssetComponent1563804001220 } from "./migrations/1563804001220-create-asset-component";

import { CreateErc20ContractHistory1563804010130 } from "./migrations/1563804010130-create-erc20-contract-history";
import { CreateErc20Vesting1563804010210 } from "./migrations/1563804010210-create-erc20-vesting";
import { SeedErc20Vesting1563804010220 } from "./migrations/1563804010220-seed-erc20-vesting";
import { CreateErc20VestingHistory1563804010230 } from "./migrations/1563804010230-create-erc20-vesting-history";

import { CreateErc998ContractHistory1563804030330 } from "./migrations/1563804030330-create-erc998-contract-history";
import {
  CreateErc998MarketplaceHistoryTable1563804030510
} from "./migrations/1563804030510-create-erc998-marketplace-history-table";

import { CreateErc721ContractHistory1563804040330 } from "./migrations/1563804040330-create-erc721-contract-history";
import {
  CreateErc721MarketplaceHistoryTable1563804040510
} from "./migrations/1563804040510-create-erc721-marketplace-history-table";

import { CreateErc1155ContractHistory1563804020130 } from "./migrations/1563804020130-create-erc1155-contract-history";
import {
  CreateErc1155MarketplaceHistoryTable1563804020210
} from "./migrations/1563804020210-create-erc1155-marketplace-history-table";

import { CreateAirdropTable1563804040410 } from "./migrations/1653616447810-create-airdrop";
import { SeedAirdropErc721At1563804040420 } from "./migrations/1653616447820-seed-airdrop-erc721";

import { CreateDropbox1653616447910 } from "./migrations/1653616447910-create-dropbox";
import { SeedDropboxErc721At1653616447920 } from "./migrations/1653616447920-seed-dropbox-erc721";

import { CreateExchange1653616448010 } from "./migrations/1653616448010-create-exchange";
import { SeedExchangeErc1155Erc1155At1653616448020 } from "./migrations/1653616448020-seed-exchange-erc1155-erc1155";
import {
  SeedExchangeErc721Erc1155At1653616448030
} from "./migrations/1653616448030-seed-exchange-erc721-erc1155-recipe";
import { CreateExchangeHistory1653616448050 } from "./migrations/1653616448050-create-exchnage-history";

import { Erc20VestingEntity } from "./erc20/vesting/vesting.entity";
import {
  CreateContractManagerHistoryTable1652682493386
} from "./migrations/1652682493386-create-contract-manager-history-table";
import { CreateContractManagerTable1652962207600 } from "./migrations/1652962207600-create-contract-manager-table";
import { SeedContractManager1652962207610 } from "./migrations/1652962207610-seed-contract-manager-table";
import { CreateAccessControlTable1653616447230 } from "./migrations/1653616447230-create-access-control-table";
import {
  CreateAccessControlHistoryTable1653616447240
} from "./migrations/1653616447240-create-access-control-history-table";
import { CreateAccessListTable1653616447330 } from "./migrations/1653616447330-create-access-list-table";
import { CreateAccessListHistoryTable1653616447340 } from "./migrations/1653616447340-create-access-list-history-table";
import { CreateSettingsTable1563804000010 } from "./migrations/1563804000010-create-settings-table";
import { SeedSettingsTable1563804000020 } from "./migrations/1563804000020-seed-settings-table";
import { CreateStakingTable1654751224200 } from "./migrations/1654751224200-create-staking-table";
import { SeedStakingTable1654751224210 } from "./migrations/1654751224210-seed-staking-table";
import { CreateStakingHistoryTable1654751224260 } from "./migrations/1654751224260-create-staking-history-table";
import { CreatePageTable1655626535100 } from "./migrations/1655626535100-create-page-table";
import { SeedPages1655626535110 } from "./migrations/1655626535110-seed-pages";
import { CreateStakesTable1654751224255 } from "./migrations/1654751224255-create-stakes-table";

// Check typeORM documentation for more information.
const config: PostgresConnectionOptions = {
  name: "default",
  type: "postgres",
  entities: [
    UserEntity,
    OtpEntity,
    SettingsEntity,
    ContractManagerEntity,
    AccessControlEntity,
    AccessListEntity,
    Erc20VestingEntity,
    UniContractEntity,
    UniTemplateEntity,
    StakesEntity,
    StakingRulesEntity,
    StakingHistoryEntity,
    PageEntity,
    AssetEntity,
    AssetComponentEntity,
    UniContractEntity,
    UniTemplateEntity,
    UniTokenEntity,
    AirdropEntity,
    DropboxEntity,
    ExchangeEntity,
  ],
  // We are using migrations, synchronize should public-api set to false.
  synchronize: false,
  // Run migrations automatically,
  // you can disable this if you prefer running migration manually.
  // migrationsRun: process.env.NODE_ENV !== "production",
  migrationsRun: true,
  migrationsTableName: ns,
  migrationsTransactionMode: "each",
  namingStrategy: new SnakeNamingStrategy(),
  logging: process.env.NODE_ENV === "development",
  // Allow both start:prod and start:dev to use migrations
  // __dirname is either dist or server folder, meaning either
  // the compiled js in prod or the ts in dev.
  migrations: [
    createSchema(ns),
    createDomainUint256(),
    installExtensionUUID(),
    createLanguageEnum(ns),
    createTokenTypes(ns),
    CreateSettingsTable1563804000010,
    SeedSettingsTable1563804000020,
    CreateUserTable1563804000030,
    SeedUser1563804000040,
    CreateOtpTable1563804000060,

    CreateAsset1563804000100,

    CreateUniContract1563804000110,
    SeedUniContractErc20At1563804000120,
    SeedUniContractErc721At1563804000130,
    SeedUniContractErc998At1563804000140,
    SeedUniContractErc1155At1563804000150,

    CreateUniTemplate1563804000210,
    SeedUniTemplateErc20At1563804000220,
    SeedUniTemplateErc721At1563804000230,
    SeedUniTemplateErc998At1563804000240,
    SeedUniTemplateErc1155At1563804000250,

    CreateUniToken1563804000310,
    SeedUniTokenErc1155At1563804000350,

    CreateUniBalanceTable1563804000410,
    SeedUniBalanceErc1155At1563804020410,

    CreateAssetComponent1563804001220,

    CreateErc20ContractHistory1563804010130,
    CreateErc20Vesting1563804010210,
    SeedErc20Vesting1563804010220,
    CreateErc20VestingHistory1563804010230,
    CreateErc998ContractHistory1563804030330,
    CreateErc998MarketplaceHistoryTable1563804030510,
    CreateErc721ContractHistory1563804040330,
    CreateErc721MarketplaceHistoryTable1563804040510,
    CreateErc1155ContractHistory1563804020130,
    CreateErc1155MarketplaceHistoryTable1563804020210,

    CreateContractManagerHistoryTable1652682493386,
    CreateAccessControlTable1653616447230,
    CreateAccessControlHistoryTable1653616447240,
    CreateAccessListTable1653616447330,
    CreateAccessListHistoryTable1653616447340,
    CreateContractManagerTable1652962207600,
    SeedContractManager1652962207610,

    CreateAirdropTable1563804040410,
    SeedAirdropErc721At1563804040420,

    CreateDropbox1653616447910,
    SeedDropboxErc721At1653616447920,

    CreateExchange1653616448010,
    SeedExchangeErc1155Erc1155At1653616448020,
    SeedExchangeErc721Erc1155At1653616448030,
    CreateExchangeHistory1653616448050,

    CreateStakingTable1654751224200,
    SeedStakingTable1654751224210,
    CreateStakesTable1654751224255,
    CreateStakingHistoryTable1654751224260,

    CreatePageTable1655626535100,
    SeedPages1655626535110,
  ],
};

export default config;
