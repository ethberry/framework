import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { PaginationDto } from "@gemunion/collection";

import { WalletPayeesEntity } from "./wallet-payees.entity";
import { BalanceEntity } from "../hierarchy/balance/balance.entity";

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

  public search(dto: PaginationDto): Promise<[Array<WalletPayeesEntity>, number]> {
    const { skip, take } = dto;

    const queryBuilder = this.payeesEntityRepository.createQueryBuilder("payee");

    queryBuilder.select();

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "payee.shares": "DESC",
    });

    return queryBuilder.getManyAndCount();
  }
}
