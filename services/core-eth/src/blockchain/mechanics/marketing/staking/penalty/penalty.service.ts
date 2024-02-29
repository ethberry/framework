import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { StakingPenaltyEntity } from "./penalty.entity";

@Injectable()
export class StakingPenaltyService {
  constructor(
    @InjectRepository(StakingPenaltyEntity)
    private readonly stakingPenaltyRepository: Repository<StakingPenaltyEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<StakingPenaltyEntity>,
    options?: FindOneOptions<StakingPenaltyEntity>,
  ): Promise<StakingPenaltyEntity | null> {
    return this.stakingPenaltyRepository.findOne({ where, ...options });
  }

  public create(dto: DeepPartial<StakingPenaltyEntity>): Promise<StakingPenaltyEntity> {
    return this.stakingPenaltyRepository.create(dto).save();
  }
}
