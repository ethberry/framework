import { ForbiddenException, Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, IsNull, Repository } from "typeorm";

import { ModuleType, TokenType } from "@framework/types";

import { UserEntity } from "../../infrastructure/user/user.entity";
import { RatePlanService } from "../../infrastructure/rate-plan/rate-plan.service";
import { ContractService } from "../hierarchy/contract/contract.service";
import { ContractManagerEntity } from "./contract-manager.entity";

@Injectable()
export class ContractManagerService {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    @InjectRepository(ContractManagerEntity)
    private readonly contractManagerEntityRepository: Repository<ContractManagerEntity>,
    private readonly planService: RatePlanService,
    private readonly contractService: ContractService,
  ) {}

  public findOne(
    where: FindOptionsWhere<ContractManagerEntity>,
    options?: FindOneOptions<ContractManagerEntity>,
  ): Promise<ContractManagerEntity | null> {
    return this.contractManagerEntityRepository.findOne({ where, ...options });
  }

  public async validateDeployment(
    userEntity: UserEntity,
    contractModule: ModuleType,
    contractType: TokenType | null,
  ): Promise<void> {
    const limit = await this.planService.getPlanLimits(userEntity, contractModule, contractType);
    const count = await this.contractService.count({
      contractModule,
      contractType: contractType || IsNull(),
    });

    if (count >= limit) {
      throw new ForbiddenException("rateLimitExceeded");
    }
  }
}
