import { Test, TestingModule } from "@nestjs/testing";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Logger } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ZeroAddress } from "ethers";

import { LicenseModule } from "@ethberry/nest-js-module-license";
import { SignerModule } from "@framework/nest-js-module-exchange-signer";
import { SecretManagerModule } from "@ethberry/nest-js-module-secret-manager-gcp";
import { wallet } from "@ethberry/constants";
import { testChainId } from "@framework/constants";

import ormconfig from "../../../../../ormconfig";
import { SettingsModule } from "../../../../../infrastructure/settings/settings.module";
import { ContractModule } from "../../../../hierarchy/contract/contract.module";
import { MerchantEntity } from "../../../../../infrastructure/merchant/merchant.entity";
import { ContractEntity } from "../../../../hierarchy/contract/contract.entity";
import { UserEntity } from "../../../../../infrastructure/user/user.entity";
import { TemplateEntity } from "../../../../hierarchy/template/template.entity";
import { AssetEntity } from "../../../../exchange/asset/asset.entity";
import { AssetComponentEntity } from "../../../../exchange/asset/asset-component.entity";
import { SettingsEntity } from "../../../../../infrastructure/settings/settings.entity";
import { VestingBoxModule } from "../box/box.module";
import { VestingBoxEntity } from "../box/box.entity";
import { VestingSignSeedService } from "./sign.seed.service";
import { VestingSignService } from "./sign.service";
import { VestingSignSeedModule } from "./sign.seed.module";

describe("VestingSignService", () => {
  let vestingSignService: VestingSignService;
  let vestingSignSeedService: VestingSignSeedService;

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
            return configService.get<string>("GEMUNION_API_KEY", "");
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
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => {
            return {
              ...ormconfig,
              url: configService.get<string>("POSTGRES_URL", "postgres://postgres:password@127.0.0.1/postgres"),
              keepConnectionAlive: configService.get<string>("NODE_ENV", "development") === "test",
            };
          },
        }),
        TypeOrmModule.forFeature([
          SettingsEntity,
          MerchantEntity,
          UserEntity,
          ContractEntity,
          TemplateEntity,
          AssetEntity,
          AssetComponentEntity,
          VestingBoxEntity,
        ]),
        SettingsModule,
        SignerModule,
        ContractModule,
        VestingBoxModule,
        VestingSignSeedModule,
      ],
      providers: [Logger, VestingSignService, VestingSignSeedService],
    }).compile();

    vestingSignService = module.get<VestingSignService>(VestingSignService);
    vestingSignSeedService = module.get<VestingSignSeedService>(VestingSignSeedService);
  });

  afterEach(async () => {
    await vestingSignSeedService.tearDown();
  });

  describe("sign", () => {
    it("should find user", async () => {
      const entities = await vestingSignSeedService.setup();
      const signature = await vestingSignService.sign(
        {
          vestingBoxId: entities.boxes[0].id,
          referrer: ZeroAddress,
          chainId: Number(testChainId),
          account: wallet,
        },
        entities.users[0],
      );
      expect(signature.expiresAt).toEqual(0);
    });
  });
});
