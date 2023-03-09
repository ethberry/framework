import { Test, TestingModule } from "@nestjs/testing";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Logger } from "@nestjs/common";

import { GemunionTypeormModule } from "@gemunion/nest-js-module-typeorm-debug";
import { LicenseModule } from "@gemunion/nest-js-module-license";
import { ContractFeatures, ContractStatus, ModuleType, TokenType } from "@framework/types";

import ormconfig from "../../../ormconfig";
import { ContractService } from "./contract.service";
import { ContractSeedService } from "./contract.seed.service";
import { ContractSeedModule } from "./contract.seed.module";
import { ContractEntity } from "./contract.entity";
import { UserEntity } from "../../../infrastructure/user/user.entity";

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
        TypeOrmModule.forFeature([ContractEntity, UserEntity]),
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
    it("should find one", async () => {
      await contractSeedService.setup();

      const contractEntity = await contractService.findOne({
        contractStatus: ContractStatus.NEW,
      });
      expect(contractEntity).toMatchObject({
        contractStatus: ContractStatus.NEW,
        contractType: TokenType.ERC20,
      });
    });
  });

  describe("autocomplete", () => {
    it("should use default filter", async () => {
      const { users } = await contractSeedService.setup();

      const contractEntities = await contractService.autocomplete({}, users[0]);
      expect(contractEntities).toHaveLength(4);
    });

    it("should filter by contractStatus", async () => {
      const { users } = await contractSeedService.setup();

      const contractEntities = await contractService.autocomplete(
        {
          contractStatus: [ContractStatus.ACTIVE],
        },
        users[0],
      );
      expect(contractEntities).toHaveLength(2);
    });

    it("should filter by contractType", async () => {
      const { users } = await contractSeedService.setup();

      const contractEntities = await contractService.autocomplete(
        {
          contractType: [TokenType.ERC20],
        },
        users[0],
      );
      expect(contractEntities).toHaveLength(2);
    });

    it("should filter by contractModule", async () => {
      const { users } = await contractSeedService.setup();

      const contractEntities = await contractService.autocomplete(
        {
          contractModule: [ModuleType.HIERARCHY],
        },
        users[0],
      );
      expect(contractEntities).toHaveLength(2);
    });

    it("should filter by contractFeatures", async () => {
      const { users } = await contractSeedService.setup();

      const contractEntities = await contractService.autocomplete(
        {
          contractFeatures: [ContractFeatures.GENES],
        },
        users[0],
      );
      expect(contractEntities).toHaveLength(2);
    });
  });
});
