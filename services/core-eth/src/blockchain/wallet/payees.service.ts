import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { PayeesEntity } from "./payees.entity";

@Injectable()
export class PayeesService {
  constructor(
    @InjectRepository(PayeesEntity)
    private readonly payeesEntityRepository: Repository<PayeesEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<PayeesEntity>,
    options?: FindOneOptions<PayeesEntity>,
  ): Promise<PayeesEntity | null> {
    return this.payeesEntityRepository.findOne({ where, ...options });
  }

  public findAll(
    where: FindOptionsWhere<PayeesEntity>,
    options?: FindOneOptions<PayeesEntity>,
  ): Promise<Array<PayeesEntity>> {
    return this.payeesEntityRepository.find({ where, ...options });
  }

  public async create(dto: DeepPartial<PayeesEntity>): Promise<PayeesEntity> {
    return this.payeesEntityRepository.create(dto).save();
  }
}
