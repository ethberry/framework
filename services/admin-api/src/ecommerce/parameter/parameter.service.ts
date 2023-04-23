import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";

import { ParameterEntity } from "./parameter.entity";

@Injectable()
export class ParameterService {
  constructor(
    @InjectRepository(ParameterEntity)
    private readonly photoEntityRepository: Repository<ParameterEntity>,
  ) {}

  public findOne(where: FindOptionsWhere<ParameterEntity>): Promise<ParameterEntity | null> {
    return this.photoEntityRepository.findOne({ where });
  }
}
