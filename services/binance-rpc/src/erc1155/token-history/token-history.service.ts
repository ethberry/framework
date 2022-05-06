import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";

import { Erc1155TokenHistoryEntity } from "./token-history.entity";

@Injectable()
export class Erc1155TokenHistoryService {
  constructor(
    @InjectRepository(Erc1155TokenHistoryEntity)
    private readonly erc1155HistoryEntity: Repository<Erc1155TokenHistoryEntity>,
  ) {}

  public async create(dto: DeepPartial<Erc1155TokenHistoryEntity>): Promise<Erc1155TokenHistoryEntity> {
    return this.erc1155HistoryEntity.create(dto).save();
  }
}
