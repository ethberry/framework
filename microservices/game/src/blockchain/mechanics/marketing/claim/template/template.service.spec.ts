import { Test, TestingModule } from "@nestjs/testing";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Logger } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { EthBerryTypeormModule } from "@ethberry/nest-js-module-typeorm-debug";
import { LicenseModule } from "@ethberry/nest-js-module-license";
import { SecretManagerModule } from "@ethberry/nest-js-module-secret-manager-gcp";
import { SignerModule } from "@framework/nest-js-module-exchange-signer";

import ormconfig from "../../../../../ormconfig";
import { UserEntity } from "../../../../../infrastructure/user/user.entity";
import { MerchantEntity } from "../../../../../infrastructure/merchant/merchant.entity";
import { AssetEntity } from "../../../../exchange/asset/asset.entity";
import { AssetComponentEntity } from "../../../../exchange/asset/asset-component.entity";
import { ContractEntity } from "../../../../hierarchy/contract/contract.entity";
import { TemplateEntity } from "../../../../hierarchy/template/template.entity";
import { AssetModule } from "../../../../exchange/asset/asset.module";
import { ContractModule } from "../../../../hierarchy/contract/contract.module";
import { ClaimTemplateService } from "./template.service";
import { ClaimEntity } from "../claim.entity";
import { ClaimSeedModule } from "./template.seed.module";
import { ClaimSeedService } from "./template.seed.service";

describe("ClaimService", () => {
  let claimService: ClaimTemplateService;
  let claimSeedService: ClaimSeedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: `.env.${process.env.NODE_ENV as string}`,
        }),
        LicenseModule.forRootAsync(LicenseModule, {
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService): string => {
            return configService.get<string>("ETHBERRY_API_KEY", "");
          },
        }),
        SecretManagerModule.forRootAsync(SecretManagerModule, {
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => {
            return {
              keyFile: configService.get<string>("GCLOUD_KEYFILE_BASE64_PATH", ""),
            };
          },
        }),
        EthBerryTypeormModule.forRoot(ormconfig),
        TypeOrmModule.forFeature([
          MerchantEntity,
          UserEntity,
          AssetEntity,
          AssetComponentEntity,
          ContractEntity,
          TemplateEntity,
          ClaimEntity,
        ]),
        ClaimSeedModule,
        AssetModule,
        ContractModule,
        SignerModule,
      ],
      providers: [Logger, ClaimTemplateService, ClaimSeedService],
    }).compile();

    claimService = module.get<ClaimTemplateService>(ClaimTemplateService);
    claimSeedService = module.get<ClaimSeedService>(ClaimSeedService);
  });

  afterEach(async () => {
    await claimSeedService.tearDown();
  });

  describe("findOne", () => {
    it("should find claim", async () => {
      const entities = await claimSeedService.setup();
      const claimEntity = await claimService.findOne({ id: entities.claims[0].id });
      expect(claimEntity?.merchantId).toEqual(entities.merchants[0].id);
    });
  });

  describe("findOneWithRelations", () => {
    it("should find claim", async () => {
      const entities = await claimSeedService.setup();
      const claimEntity = await claimService.findOneWithRelations({ id: entities.claims[0].id });
      expect(claimEntity?.merchantId).toEqual(entities.merchants[0].id);
      expect(claimEntity?.item.components[0].contract.merchantId).toEqual(entities.merchants[0].id);
    });
  });
});