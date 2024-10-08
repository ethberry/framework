import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IsNull } from "typeorm";

import { PaymentRequiredException } from "@ethberry/nest-js-utils";
import { BusinessType, ModuleType, TokenType } from "@framework/types";

import { UserEntity } from "../../infrastructure/user/user.entity";
import { RatePlanService } from "../../infrastructure/rate-plan/rate-plan.service";
import { ContractService } from "../hierarchy/contract/contract.service";

@Injectable()
export class ContractManagerService {
  constructor(
    private readonly planService: RatePlanService,
    private readonly contractService: ContractService,
    protected readonly configService: ConfigService,
  ) {}

  public async validateDeployment(
    userEntity: UserEntity,
    contractModule: ModuleType,
    contractType: TokenType | null,
  ): Promise<void> {
    const businessType = this.configService.get<BusinessType>("BUSINESS_TYPE", BusinessType.B2B);

    if (businessType === BusinessType.B2B) {
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
}
