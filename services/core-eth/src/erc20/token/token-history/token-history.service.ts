import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";

import { Erc20TokenHistoryEntity } from "./token-history.entity";

@Injectable()
export class Erc20TokenHistoryService {
  constructor(
    @InjectRepository(Erc20TokenHistoryEntity)
    private readonly erc20TokenHistoryEntityRepository: Repository<Erc20TokenHistoryEntity>,
  ) {}

  public async create(dto: DeepPartial<Erc20TokenHistoryEntity>): Promise<Erc20TokenHistoryEntity> {
    return this.erc20TokenHistoryEntityRepository.create(dto).save();
  }
}
