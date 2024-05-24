import { Test, TestingModule } from "@nestjs/testing";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Logger } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { GemunionTypeormModule } from "@gemunion/nest-js-module-typeorm-debug";
import { LicenseModule } from "@gemunion/nest-js-module-license";
import { testChainId } from "@framework/constants";

import ormconfig from "../../../../../ormconfig";
import { ContractEntity } from "../../../../hierarchy/contract/contract.entity";
import { TemplateEntity } from "../../../../hierarchy/template/template.entity";
import { MerchantEntity } from "../../../../../infrastructure/merchant/merchant.entity";
import { UserEntity } from "../../../../../infrastructure/user/user.entity";
import { AssetEntity } from "../../../../exchange/asset/asset.entity";
import { AssetComponentEntity } from "../../../../exchange/asset/asset-component.entity";
import { MysteryBoxService } from "./box.service";
import { MysteryBoxEntity } from "./box.entity";
import { MysteryBoxSeedModule } from "./box.seed.module";
import { MysteryBoxSeedService } from "./box.seed.service";

describe("MysteryBoxService", () => {
  let mysteryBoxService: MysteryBoxService;
  let mysteryBoxSeedService: MysteryBoxSeedService;

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
        TypeOrmModule.forFeature([
          MerchantEntity,
          UserEntity,
          AssetEntity,
          AssetComponentEntity,
          ContractEntity,
          TemplateEntity,
          MysteryBoxEntity,
        ]),
        MysteryBoxSeedModule,
      ],
      providers: [Logger, MysteryBoxService, MysteryBoxSeedService],
    }).compile();

    mysteryBoxService = module.get<MysteryBoxService>(MysteryBoxService);
    mysteryBoxSeedService = module.get<MysteryBoxSeedService>(MysteryBoxSeedService);
  });

  afterEach(async () => {
    await mysteryBoxSeedService.tearDown();
  });

  describe("findOne", () => {
    it("should find mystery box", async () => {
      const entities = await mysteryBoxSeedService.setup();
      const mysteryBoxEntity = await mysteryBoxService.findOne(
        { id: entities.boxes[0].id },
        {
          relations: {
            template: {
              contract: true,
            },
          },
        },
      );
      expect(mysteryBoxEntity?.template?.contract?.merchantId).toEqual(entities.merchants[0].id);
    });
  });

  describe("search", () => {
    it("should find all mystery boxes for merchant", async () => {
      const entities = await mysteryBoxSeedService.setup();
      const [mysteryBoxEntities, count] = await mysteryBoxService.search(
        {
          chainId: testChainId,
        },
        entities.merchants[0],
      );
      expect(mysteryBoxEntities.length).toEqual(1);
      expect(count).toEqual(1);
    });
  });
});
