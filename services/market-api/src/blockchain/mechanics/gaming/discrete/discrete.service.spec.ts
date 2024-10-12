import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Logger } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { SecretManagerModule } from "@ethberry/nest-js-module-secret-manager-gcp";
import { EthBerryTypeormModule } from "@ethberry/nest-js-module-typeorm-debug";
import { LicenseModule } from "@ethberry/nest-js-module-license";
import { SignerModule } from "@framework/nest-js-module-exchange-signer";
import { DiscreteStrategy } from "@framework/types";

import ormconfig from "../../../../ormconfig";
import { DiscreteService } from "./discrete.service";
import { DiscreteEntity } from "./discrete.entity";
import { TokenModule } from "../../../hierarchy/token/token.module";
import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { SettingsModule } from "../../../../infrastructure/settings/settings.module";

describe("DiscreteService", () => {
  let discreteService: DiscreteService;

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
        EthBerryTypeormModule.forRoot(ormconfig),
        TypeOrmModule.forFeature([DiscreteEntity]),
        SecretManagerModule.forRootAsync(SecretManagerModule, {
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => {
            return {
              keyFile: configService.get<string>("GCLOUD_KEYFILE_BASE64_PATH", ""),
            };
          },
        }),
        SignerModule,
        TokenModule,
        ContractModule,
        SettingsModule,
      ],
      providers: [Logger, DiscreteService],
    }).compile();

    discreteService = module.get<DiscreteService>(DiscreteService);
  });

  it("should be defined", () => {
    expect(discreteService).toBeDefined();
  });

  describe("getMultiplier", () => {
    describe("FLAT", () => {
      it.each(new Array(5).fill(null).map((e, i) => i))("should get multiplier for %i", i => {
        const multiplier = discreteService.getMultiplier(i, {
          discreteStrategy: DiscreteStrategy.FLAT,
        } as DiscreteEntity);
        expect(multiplier.toString()).toEqual(1);
      });
    });

    describe("LINEAR", () => {
      it.each(new Array(5).fill(null).map((e, i) => i))("should get multiplier for %i", i => {
        const multiplier = discreteService.getMultiplier(i, {
          discreteStrategy: DiscreteStrategy.LINEAR,
        } as DiscreteEntity);
        expect(multiplier.toString()).toEqual(i.toString());
      });
    });

    describe.only("EXPONENTIAL, rate 1", () => {
      it.each([
        [0, 1],
        [1, 1.01],
        [2, 1.0201],
        [3, 1.0303010000000001],
        [4, 1.04060401],
      ])("should get multiplier for %i", (i, j) => {
        const multiplier = discreteService.getMultiplier(i, {
          discreteStrategy: DiscreteStrategy.EXPONENTIAL,
          growthRate: 1,
        } as DiscreteEntity);
        expect(multiplier).toEqual(j);
      });
    });

    describe("EXPONENTIAL, rate 100", () => {
      it.each([
        [0, 1],
        [1, 2],
        [2, 4],
        [3, 8],
        [4, 16],
      ])("should get multiplier for %i", (i, j) => {
        const multiplier = discreteService.getMultiplier(i, {
          discreteStrategy: DiscreteStrategy.EXPONENTIAL,
          growthRate: 100,
        } as DiscreteEntity);
        expect(multiplier).toEqual(j);
      });
    });
  });
});
