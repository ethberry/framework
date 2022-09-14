import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";

import { PyramidHistoryEntity } from "./history.entity";

@Injectable()
export class PyramidHistoryService {
  constructor(
    @InjectRepository(PyramidHistoryEntity)
    private readonly pyramidHistoryEntityRepository: Repository<PyramidHistoryEntity>,
  ) {}

  public async create(dto: DeepPartial<PyramidHistoryEntity>): Promise<PyramidHistoryEntity> {
    return this.pyramidHistoryEntityRepository.create(dto).save();
  }
}
