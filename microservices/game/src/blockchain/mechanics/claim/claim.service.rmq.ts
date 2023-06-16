import { IClaimCreateDto } from "@framework/types";
import { Injectable, NotFoundException } from "@nestjs/common";

import { MerchantService } from "../../../infrastructure/merchant/merchant.service";
import { ClaimEntity } from "./claim.entity";
import { ClaimService } from "./claim.service";

@Injectable()
export class ClaimServiceRmq {
  constructor(private readonly claimService: ClaimService, private readonly merchantService: MerchantService) {}

  public async create(dto: IClaimCreateDto): Promise<ClaimEntity> {
    const merchantEntity = await this.merchantService.findOne({
      id: 1,
    });

    if (!merchantEntity) {
      throw new NotFoundException("merchantNotFound");
    }

    return this.claimService.create(dto, merchantEntity);
  }
}
