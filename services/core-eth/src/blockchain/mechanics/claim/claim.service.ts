import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { ClaimEntity } from "./claim.entity";
import { ClaimStatus } from "@framework/types";

@Injectable()
export class ClaimService {
  constructor(
    @InjectRepository(ClaimEntity)
    private readonly claimEntityRepository: Repository<ClaimEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<ClaimEntity>,
    options?: FindOneOptions<ClaimEntity>,
  ): Promise<ClaimEntity | null> {
    return this.claimEntityRepository.findOne({ where, ...options });
  }

  public async update(where: FindOptionsWhere<ClaimEntity>, dto: Partial<ClaimEntity>): Promise<ClaimEntity> {
    const claimEntity = await this.findOne(where);

    if (!claimEntity) {
      throw new NotFoundException("claimNotFound");
    }

    Object.assign(claimEntity, dto);

    return claimEntity.save();
  }

  public async redeemClaim(claimId: number): Promise<void> {
    await this.update({ id: claimId }, { claimStatus: ClaimStatus.REDEEMED });
  }
}
