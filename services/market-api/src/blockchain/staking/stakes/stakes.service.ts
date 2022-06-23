import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { StakesEntity } from "./stakes.entity";
import { Erc721TemplateEntity } from "../../../erc721/template/template.entity";
import { StakesSearchDto } from "./dto";
import { IStakesSearchDto } from "@framework/types";

@Injectable()
export class StakesService {
  constructor(
    @InjectRepository(StakesEntity)
    private readonly stakesEntityRepository: Repository<StakesEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<StakesEntity>,
    options?: FindOneOptions<StakesEntity>,
  ): Promise<StakesEntity | null> {
    return this.stakesEntityRepository.findOne({ where, ...options });
  }

  public findAll(
    where: FindOptionsWhere<StakesEntity>,
    options?: FindOneOptions<StakesEntity>,
  ): Promise<Array<StakesEntity>> {
    return this.stakesEntityRepository.find({ where, ...options });
  }

  public async search(dto: IStakesSearchDto): Promise<[Array<StakesEntity>, number]> {
    const { stakeStatus, skip, take } = dto;

    const queryBuilder = this.stakesEntityRepository.createQueryBuilder("stake");

    queryBuilder.select();

    if (stakeStatus) {
      if (stakeStatus.length === 1) {
        queryBuilder.andWhere("stake.stakeStatus = :stakeStatus", { stakeStatus: stakeStatus[0] });
      } else {
        queryBuilder.andWhere("stake.stakeStatus IN(:...stakeStatus)", { stakeStatus });
      }
    }

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy("stake.createdAt", "DESC");

    return queryBuilder.getManyAndCount();
  }
}
