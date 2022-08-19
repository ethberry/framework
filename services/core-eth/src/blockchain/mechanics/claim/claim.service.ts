import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { ClaimEntity } from "./claim.entity";

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

  public async update(where: FindOptionsWhere<ClaimEntity>, dto: DeepPartial<ClaimEntity>): Promise<ClaimEntity> {
    const { ...rest } = dto;

    const claimEntity = await this.findOne(where);

    if (!claimEntity) {
      throw new NotFoundException("claimNotFound");
    }

    Object.assign(claimEntity, rest);

    return claimEntity.save();
  }
}
