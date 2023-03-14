import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PaginationDto } from "@gemunion/collection";

import { PayeesEntity } from "./payees.entity";

@Injectable()
export class PayeesService {
  constructor(
    @InjectRepository(PayeesEntity)
    private readonly payeesEntityRepository: Repository<PayeesEntity>,
  ) {}

  public search(dto: PaginationDto): Promise<[Array<PayeesEntity>, number]> {
    const { skip, take } = dto;

    const queryBuilder = this.payeesEntityRepository.createQueryBuilder("payee");

    queryBuilder.select();
    queryBuilder.leftJoinAndSelect("payee.contract", "contract");

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "contract.title": "ASC",
      "payee.shares": "DESC",
    });

    return queryBuilder.getManyAndCount();
  }
}
