import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Logger } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { WeiPerEther } from "ethers";

import { GemunionTypeormModule } from "@gemunion/nest-js-module-typeorm-debug";
import { LicenseModule } from "@gemunion/nest-js-module-license";
import { SignerModule } from "@framework/nest-js-module-exchange-signer";
import { GradeStrategy } from "@framework/types";

import ormconfig from "../../../ormconfig";
import { GradeService } from "./grade.service";
import { GradeEntity } from "./grade.entity";
import { TokenModule } from "../../hierarchy/token/token.module";

describe("GradeService", () => {
  let gradeService: GradeService;

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
        TypeOrmModule.forFeature([GradeEntity]),
        SignerModule,
        TokenModule,
      ],
      providers: [Logger, GradeService],
    }).compile();

    gradeService = module.get<GradeService>(GradeService);
  });

  it("should be defined", () => {
    expect(gradeService).toBeDefined();
  });

  describe("getMultiplier", () => {
    describe("FLAT", () => {
      it.each(new Array(5).fill(null).map((e, i) => i))("should get multiplier for %i", i => {
        const multiplier = gradeService.getMultiplier(i, WeiPerEther.toString(), {
          gradeStrategy: GradeStrategy.FLAT,
        } as GradeEntity);
        expect(multiplier.toString()).toEqual(WeiPerEther.toString());
      });
    });

    describe("LINEAR", () => {
      it.each(new Array(5).fill(null).map((e, i) => i))("should get multiplier for %i", i => {
        const multiplier = gradeService.getMultiplier(i, WeiPerEther.toString(), {
          gradeStrategy: GradeStrategy.LINEAR,
        } as GradeEntity);
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
          gradeStrategy: GradeStrategy.EXPONENTIAL,
          growthRate: 1,
        } as GradeEntity);
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
          gradeStrategy: GradeStrategy.EXPONENTIAL,
          growthRate: 100,
        } as GradeEntity);
        expect(multiplier.toString()).toEqual(j);
      });
    });
  });
});
