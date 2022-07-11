import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";

import { Erc20ContractHistoryEntity } from "./contract-history.entity";

@Injectable()
export class Erc20ContractHistoryService {
  constructor(
    @InjectRepository(Erc20ContractHistoryEntity)
    private readonly Erc20ContractHistoryEntityRepository: Repository<Erc20ContractHistoryEntity>,
  ) {}

  public async create(dto: DeepPartial<Erc20ContractHistoryEntity>): Promise<Erc20ContractHistoryEntity> {
    return this.Erc20ContractHistoryEntityRepository.create(dto).save();
  }
}
