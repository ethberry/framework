import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ClientProxy } from "@nestjs/microservices";

import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import type { IPaginationDto } from "@gemunion/types-collection";
import { RmqProviderType } from "@framework/types";
import { RaffleRoundEntity } from "./round.entity";
import { RaffleScheduleUpdateDto } from "./dto";

@Injectable()
export class RaffleRoundService {
  constructor(
    @InjectRepository(RaffleRoundEntity)
    private readonly roundEntityRepository: Repository<RaffleRoundEntity>,
    @Inject(RmqProviderType.SCHEDULE_SERVICE)
    private readonly scheduleProxy: ClientProxy,
  ) {}

  public async search(dto: Partial<IPaginationDto>): Promise<[Array<RaffleRoundEntity>, number]> {
    const { skip, take } = dto;

    const queryBuilder = this.roundEntityRepository.createQueryBuilder("round");

    queryBuilder.select();

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy("round.createdAt", "DESC");

    return queryBuilder.getManyAndCount();
  }

  public findOne(
    where: FindOptionsWhere<RaffleRoundEntity>,
    options?: FindOneOptions<RaffleRoundEntity>,
  ): Promise<RaffleRoundEntity | null> {
    return this.roundEntityRepository.findOne({ where, ...options });
  }

  public async autocomplete(): Promise<Array<RaffleRoundEntity>> {
    const queryBuilder = this.roundEntityRepository.createQueryBuilder("round");

    queryBuilder.select(["id", "id::VARCHAR as title"]);

    queryBuilder.orderBy({
      "round.createdAt": "DESC",
    });

    return queryBuilder.getRawMany();
  }

  public async updateSchedule(dto: RaffleScheduleUpdateDto): Promise<any> {
    return this.scheduleProxy.emit(RmqProviderType.SCHEDULE_SERVICE, dto).toPromise();
  }
}
