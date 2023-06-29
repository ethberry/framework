import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ContractEventType } from "@framework/types";

import { EventHistoryEntity } from "./event-history.entity";

@Injectable()
export class EventHistoryService {
  constructor(
    @InjectRepository(EventHistoryEntity)
    private readonly eventHistoryEntityRepository: Repository<EventHistoryEntity>,
  ) {}

  public countEventsByType(eventType: ContractEventType, externalId: number): Promise<number> {
    const queryBuilder = this.eventHistoryEntityRepository.createQueryBuilder("history");
    queryBuilder.andWhere("history.event_type = :eventType", { eventType });
    queryBuilder.andWhere("LOWER(history.event_data->>'externalId') = :externalId", { externalId });
    return queryBuilder.getCount();
  }
}
