import { Injectable } from "@nestjs/common";
import { IsNull } from "typeorm";

import { PaymentRequiredException } from "@ethberry/nest-js-utils";
import { ModuleType, TokenType } from "@framework/types";

import { UserEntity } from "../../infrastructure/user/user.entity";
import { RatePlanService } from "../../infrastructure/rate-plan/rate-plan.service";
import { ContractService } from "../hierarchy/contract/contract.service";

@Injectable()
export class ContractManagerService {
  constructor(
    private readonly planService: RatePlanService,
    private readonly contractService: ContractService,
  ) {}

  public async validateDeployment(
    userEntity: UserEntity,
    contractModule: ModuleType,
    contractType: TokenType | null,
  ): Promise<void> {
    const limit = await this.planService.getPlanLimits(userEntity, contractModule, contractType);
    const count = await this.contractService.count({
      contractModule,
      contractType: contractType || IsNull(),
      merchantId: userEntity.merchantId,
    });

    if (limit && count >= limit) {
      throw new PaymentRequiredException("paymentRequired");
    }
  }
}
