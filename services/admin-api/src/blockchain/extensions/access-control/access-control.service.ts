import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { ContractEntity } from "../../hierarchy/contract/contract.entity";
import { AccessControlEntity } from "./access-control.entity";
import { IAccessControlCheck } from "./interfaces";

@Injectable()
export class AccessControlService {
  constructor(
    @InjectRepository(AccessControlEntity)
    private readonly accessControlEntityRepository: Repository<AccessControlEntity>,
  ) {}

  public async create(dto: DeepPartial<AccessControlEntity>): Promise<AccessControlEntity> {
    return this.accessControlEntityRepository.create(dto).save();
  }

  public findOne(
    where: FindOptionsWhere<AccessControlEntity>,
    options?: FindOneOptions<AccessControlEntity>,
  ): Promise<AccessControlEntity | null> {
    return this.accessControlEntityRepository.findOne({ where, ...options });
  }

  public findAll(
    where: FindOptionsWhere<AccessControlEntity>,
    options?: FindOneOptions<AccessControlEntity>,
  ): Promise<Array<AccessControlEntity>> {
    return this.accessControlEntityRepository.find({ where, ...options });
  }

  public async findAllWithRelations(where: FindOptionsWhere<AccessControlEntity>): Promise<Array<AccessControlEntity>> {
    const queryBuilder = this.accessControlEntityRepository.createQueryBuilder("roles");

    queryBuilder.select();

    queryBuilder.where("roles.address = :address", {
      address: where.address,
    });

    queryBuilder.leftJoinAndMapOne(
      "roles.address_contract",
      ContractEntity,
      "address_contract",
      `roles.address = address_contract.address`,
    );

    queryBuilder.leftJoinAndMapOne(
      "roles.account_contract",
      ContractEntity,
      "account_contract",
      `roles.account = account_contract.address`,
    );

    queryBuilder.orderBy("roles.createdAt", "DESC");

    return queryBuilder.getMany();
  }

  public count(where: FindOptionsWhere<AccessControlEntity>): Promise<number> {
    return this.accessControlEntityRepository.count({ where });
  }

  public async check(dto: IAccessControlCheck): Promise<{ hasRole: boolean }> {
    const count = await this.count(dto);
    return { hasRole: count > 0 };
  }
}
