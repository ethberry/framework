import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository, Brackets } from "typeorm";

import { ContractEventType, IEventHistorySearchDto } from "@framework/types";
import type { IPaginationDto } from "@gemunion/types-collection";

import { UserEntity } from "../../infrastructure/user/user.entity";
import { EventHistoryEntity } from "./event-history.entity";

@Injectable()
export class EventHistoryService {
  constructor(
    @InjectRepository(EventHistoryEntity)
    private readonly eventHistoryEntityRepository: Repository<EventHistoryEntity>,
  ) {}

  public async search(dto: IEventHistorySearchDto): Promise<[Array<EventHistoryEntity>, number]> {
    const { address, tokenId, take, skip } = dto;
    const queryBuilder = this.eventHistoryEntityRepository.createQueryBuilder("history");

    queryBuilder.select();

    queryBuilder.andWhere("history.address = :address", { address });
    queryBuilder.andWhere("history.event_data->>'tokenId' = :tokenId", { tokenId });

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    return queryBuilder.getManyAndCount();
  }

  public async my(dto: IPaginationDto, userEntity: UserEntity): Promise<[Array<EventHistoryEntity>, number]> {
    const { take, skip } = dto;
    const { wallet } = userEntity;
    const queryBuilder = this.eventHistoryEntityRepository.createQueryBuilder("history");

    queryBuilder.select();

    queryBuilder.andWhere(
      new Brackets(qb => {
        qb.andWhere(
          new Brackets(qb1 => {
            qb1.andWhere("history.event_type = :eventType1", { eventType1: ContractEventType.Transfer });
            qb1.andWhere(
              new Brackets(qb2 => {
                qb2.andWhere("LOWER(history.event_data->>'from') = :wallet1", { wallet1: wallet });
                qb2.orWhere("LOWER(history.event_data->>'to') = :wallet2", { wallet2: wallet });
              }),
            );
          }),
        );
        qb.orWhere(
          new Brackets(qb1 => {
            qb1.andWhere("history.event_type = :eventType2", { eventType2: ContractEventType.Purchase });
            qb1.andWhere(
              new Brackets(qb2 => {
                qb2.andWhere("LOWER(history.event_data->>'from') = :wallet3", { wallet3: wallet });
              }),
            );
          }),
        );
      }),
    );

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "history.createdAt": "DESC",
    });

    return queryBuilder.getManyAndCount();
  }

  public findOne(
    where: FindOptionsWhere<EventHistoryEntity>,
    options?: FindOneOptions<EventHistoryEntity>,
  ): Promise<EventHistoryEntity | null> {
    return this.eventHistoryEntityRepository.findOne({ where, ...options });
  }
}
