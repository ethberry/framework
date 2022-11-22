import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { PaginationDto } from "@gemunion/collection";

import { PayeesEntity } from "./payees.entity";
import { BalanceEntity } from "../hierarchy/balance/balance.entity";

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

  public search(dto: PaginationDto): Promise<[Array<PayeesEntity>, number]> {
    const { skip, take } = dto;

    const queryBuilder = this.payeesEntityRepository.createQueryBuilder("payee");

    queryBuilder.select();
    queryBuilder.leftJoinAndSelect("payee.contract", "contract");

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "payee.shares": "DESC",
    });

    return queryBuilder.getManyAndCount();
  }

  public async autocomplete(): Promise<Array<PayeesEntity>> {
    return this.payeesEntityRepository.find({
      select: {
        id: true,
        account: true,
        shares: true,
      },
    });
  }
}
