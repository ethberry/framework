import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Logger } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { WeiPerEther } from "ethers";

import { SecretManagerModule } from "@gemunion/nest-js-module-secret-manager-gcp";
import { GemunionTypeormModule } from "@gemunion/nest-js-module-typeorm-debug";
import { LicenseModule } from "@gemunion/nest-js-module-license";
import { SignerModule } from "@framework/nest-js-module-exchange-signer";
import { DiscreteStrategy } from "@framework/types";

import ormconfig from "../../../../ormconfig";
import { DiscreteService } from "./discrete.service";
import { DiscreteEntity } from "./discrete.entity";
import { TokenModule } from "../../../hierarchy/token/token.module";
import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { SettingsModule } from "../../../../infrastructure/settings/settings.module";

describe("GradeService", () => {
  let gradeService: DiscreteService;

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
        GemunionTypeormModule.forRoot(ormconfig),
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

    gradeService = module.get<DiscreteService>(DiscreteService);
  });

  it("should be defined", () => {
    expect(gradeService).toBeDefined();
  });

  describe("getMultiplier", () => {
    describe("FLAT", () => {
      it.each(new Array(5).fill(null).map((e, i) => i))("should get multiplier for %i", i => {
        const multiplier = gradeService.getMultiplier(i, WeiPerEther.toString(), {
          discreteStrategy: DiscreteStrategy.FLAT,
        } as DiscreteEntity);
        expect(multiplier.toString()).toEqual(WeiPerEther.toString());
      });
    });

    describe("LINEAR", () => {
      it.each(new Array(5).fill(null).map((e, i) => i))("should get multiplier for %i", i => {
        const multiplier = gradeService.getMultiplier(i, WeiPerEther.toString(), {
          discreteStrategy: DiscreteStrategy.LINEAR,
        } as DiscreteEntity);
        expect(multiplier.toString()).toEqual((WeiPerEther * BigInt(i)).toString());
      });
    });

    describe("EXPONENTIAL, rate 1", () => {
      it.each([
        [0, "1000000000000000000"],
        [1, "1010000000000000000"],
        [2, "1020100000000000000"],
        [3, "1030301000000000100"],
        [4, "1040604010000000000"],
      ])("should get multiplier for %i", (i, j) => {
        const multiplier = gradeService.getMultiplier(i, WeiPerEther.toString(), {
          discreteStrategy: DiscreteStrategy.EXPONENTIAL,
          growthRate: 1,
        } as DiscreteEntity);
        expect(multiplier.toString()).toEqual(j);
      });
    });

    describe("EXPONENTIAL, rate 100", () => {
      it.each([
        [0, "1000000000000000000"],
        [1, "2000000000000000000"],
        [2, "4000000000000000000"],
        [3, "8000000000000000000"],
        [4, "16000000000000000000"],
      ])("should get multiplier for %i", (i, j) => {
        const multiplier = gradeService.getMultiplier(i, WeiPerEther.toString(), {
          discreteStrategy: DiscreteStrategy.EXPONENTIAL,
          growthRate: 100,
        } as DiscreteEntity);
        expect(multiplier.toString()).toEqual(j);
      });
    });
  });
});
