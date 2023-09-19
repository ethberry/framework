import { Test, TestingModule } from "@nestjs/testing";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ForbiddenException, Logger, NotFoundException } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { GemunionTypeormModule } from "@gemunion/nest-js-module-typeorm-debug";
import { LicenseModule } from "@gemunion/nest-js-module-license";
import { ContractFeatures, ModuleType, TokenType } from "@framework/types";

import ormconfig from "../../../ormconfig";
import { UserEntity } from "../../../infrastructure/user/user.entity";
import { MerchantEntity } from "../../../infrastructure/merchant/merchant.entity";
import { ContractService } from "./contract.service";
import { ContractEntity } from "./contract.entity";
import { ContractSeedModule } from "./contract.seed.module";
import { ContractSeedService } from "./contract.seed.service";

describe("ContractService", () => {
  let contractService: ContractService;
  let contractSeedService: ContractSeedService;

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
        TypeOrmModule.forFeature([ContractEntity, MerchantEntity, UserEntity]),
        ContractSeedModule,
      ],
      providers: [Logger, ContractService, ContractSeedService],
    }).compile();

    contractService = module.get<ContractService>(ContractService);
    contractSeedService = module.get<ContractSeedService>(ContractSeedService);
  });

  afterEach(async () => {
    await contractSeedService.tearDown();
  });

  describe("findOne", () => {
    it("should find contract", async () => {
      const entities = await contractSeedService.setup();
      const contractEntity = await contractService.findOne({ id: entities.contracts[0].id });
      expect(contractEntity?.merchantId).toEqual(entities.merchants[0].id);
    });
  });

  describe("findOneWithRelations", () => {
    it("should find contract", async () => {
      const entities = await contractSeedService.setup();
      const contractEntity = await contractService.findOneWithRelations(
        { id: entities.contracts[0].id },
        entities.merchants[0],
      );
      expect(contractEntity?.id).toEqual(entities.contracts[0].id);
      expect(contractEntity?.merchantId).toEqual(entities.merchants[0].id);
    });

    it("should fail: ForbiddenException", async () => {
      const entities = await contractSeedService.setup();
      const contractEntity = contractService.findOneWithRelations(
        { id: entities.contracts[0].id },
        entities.merchants[1],
      );
      await expect(contractEntity).rejects.toThrow(ForbiddenException);
    });
  });

  describe("findOneOrFail", () => {
    it("should find contract", async () => {
      const entities = await contractSeedService.setup();
      const contractEntity = await contractService.findOneOrFail({ id: entities.contracts[0].id });
      expect(contractEntity?.id).toEqual(entities.contracts[0].id);
      expect(contractEntity?.merchantId).toEqual(entities.merchants[0].id);
    });

    it("should fail: NotFoundException", async () => {
      await contractSeedService.setup();
      const contractEntity = contractService.findOneOrFail({ id: 0 });
      await expect(contractEntity).rejects.toThrow(NotFoundException);
    });
  });

  describe("autocomplete", () => {
    it("should find without filters", async () => {
      const entities = await contractSeedService.setup();
      const contractEntities = await contractService.autocomplete({}, entities.merchants[0]);
      expect(contractEntities.length).toEqual(3);
      expect(contractEntities[0].id).toEqual(entities.contracts[0].id);
      expect(contractEntities[1].id).toEqual(entities.contracts[4].id);
      expect(contractEntities[2].id).toEqual(entities.contracts[5].id);
    });

    it("should find with filter (contractType)", async () => {
      const entities = await contractSeedService.setup();
      const contractEntities = await contractService.autocomplete(
        {
          contractType: [TokenType.ERC20, TokenType.ERC721],
        },
        entities.merchants[0],
      );
      expect(contractEntities.length).toEqual(2);
      expect(contractEntities[0].id).toEqual(entities.contracts[4].id);
      expect(contractEntities[1].id).toEqual(entities.contracts[5].id);
    });

    it("should find with filter (contractFeatures)", async () => {
      const entities = await contractSeedService.setup();
      const contractEntities = await contractService.autocomplete(
        {
          contractFeatures: [ContractFeatures.EXTERNAL],
        },
        entities.merchants[0],
      );
      expect(contractEntities.length).toEqual(2);
      expect(contractEntities[0].id).toEqual(entities.contracts[0].id);
      expect(contractEntities[1].id).toEqual(entities.contracts[4].id);
    });

    it("should find with filter (contractModule)", async () => {
      const entities = await contractSeedService.setup();
      const contractEntities = await contractService.autocomplete(
        {
          contractModule: [ModuleType.MYSTERY],
        },
        entities.merchants[0],
      );
      expect(contractEntities.length).toEqual(2);
      expect(contractEntities[0].id).toEqual(entities.contracts[0].id);
      expect(contractEntities[1].id).toEqual(entities.contracts[5].id);
    });

    it("should find with filter (chainId)", async () => {
      const entities = await contractSeedService.setup();
      const contractEntities = await contractService.autocomplete(
        {
          chainId: 1,
        },
        entities.merchants[0],
      );
      expect(contractEntities.length).toEqual(2);
      expect(contractEntities[0].id).toEqual(entities.contracts[4].id);
      expect(contractEntities[1].id).toEqual(entities.contracts[5].id);
    });

    // TODD
  });
});
