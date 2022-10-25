import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { WalletPayeesEntity } from "./wallet-payees.entity";

@Injectable()
export class PayeesService {
  constructor(
    @InjectRepository(WalletPayeesEntity)
    private readonly payeesEntityRepository: Repository<WalletPayeesEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<WalletPayeesEntity>,
    options?: FindOneOptions<WalletPayeesEntity>,
  ): Promise<WalletPayeesEntity | null> {
    return this.payeesEntityRepository.findOne({ where, ...options });
  }

  public findAll(
    where: FindOptionsWhere<WalletPayeesEntity>,
    options?: FindOneOptions<WalletPayeesEntity>,
  ): Promise<Array<WalletPayeesEntity>> {
    return this.payeesEntityRepository.find({ where, ...options });
  }

  public async create(dto: DeepPartial<WalletPayeesEntity>): Promise<WalletPayeesEntity> {
    return this.payeesEntityRepository.create(dto).save();
  }
}
