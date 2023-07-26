import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { ModuleType, TokenType } from "@framework/types";

import { UserEntity } from "../user/user.entity";
import { RatePlanEntity } from "./rate-plan.entity";

@Injectable()
export class RatePlanService {
  constructor(
    @InjectRepository(RatePlanEntity)
    private readonly stakingDepositEntityRepository: Repository<RatePlanEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<RatePlanEntity>,
    options?: FindOneOptions<RatePlanEntity>,
  ): Promise<RatePlanEntity | null> {
    return this.stakingDepositEntityRepository.findOne({ where, ...options });
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
