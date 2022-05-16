import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";

import { ContractManagerHistoryEntity } from "./contract-manager-history.entity";

@Injectable()
export class ContractManagerHistoryService {
  constructor(
    @InjectRepository(ContractManagerHistoryEntity)
    private readonly contractManagerHistoryEntityRepository: Repository<ContractManagerHistoryEntity>,
  ) {}

  public async create(dto: DeepPartial<ContractManagerHistoryEntity>): Promise<ContractManagerHistoryEntity> {
    return this.contractManagerHistoryEntityRepository.create(dto).save();
  }
}
