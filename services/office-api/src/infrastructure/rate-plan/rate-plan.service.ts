import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { ModuleType, TokenType } from "@framework/types";

import { UserEntity } from "../user/user.entity";
import { RatePlanEntity } from "./rate-plan.entity";
import { IRatePlanUpdateDto } from "./interfaces";

@Injectable()
export class RatePlanService {
  constructor(
    @InjectRepository(RatePlanEntity)
    private readonly ratePlanEntityRepository: Repository<RatePlanEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<RatePlanEntity>,
    options?: FindOneOptions<RatePlanEntity>,
  ): Promise<RatePlanEntity | null> {
    return this.ratePlanEntityRepository.findOne({ where, ...options });
  }

  public findAll(
    where: FindOptionsWhere<RatePlanEntity>,
    options?: FindOneOptions<RatePlanEntity>,
  ): Promise<[Array<RatePlanEntity>, number]> {
    return this.ratePlanEntityRepository.findAndCount({ where, ...options });
  }

  public async update(dto: IRatePlanUpdateDto): Promise<void> {
    for (const { ratePlanId, amount } of dto.limits) {
      await this.ratePlanEntityRepository.update({ id: ratePlanId }, { amount });
    }
  }

  public async getPlanLimits(
    _userEntity: UserEntity,
    _contractModule: ModuleType,
    _contractType: TokenType | null,
  ): Promise<number> {
    // always allow to deploy from office
    return Promise.resolve(1e6);
  }
}
