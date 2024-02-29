import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import type { IPaginationDto } from "@gemunion/types-collection";

import { TokenType } from "@framework/types";

import { RentEntity } from "./rent.entity";
import { IRentAutocompleteDto } from "./interfaces/autocomplete";

@Injectable()
export class RentService {
  constructor(
    @InjectRepository(RentEntity)
    private readonly rentEntityRepository: Repository<RentEntity>,
  ) {}

  public async search(dto: Partial<IPaginationDto>): Promise<[Array<RentEntity>, number]> {
    const { skip, take } = dto;

    const queryBuilder = this.rentEntityRepository.createQueryBuilder("rent");

    queryBuilder.leftJoinAndSelect("rent.contract", "contract");

    queryBuilder.select();

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "rent.createdAt": "DESC",
    });

    return queryBuilder.getManyAndCount();
  }

  public async autocomplete(dto: IRentAutocompleteDto): Promise<Array<RentEntity>> {
    const { contractId, rentStatus } = dto;
    const where = {};

    // TODO add rentStatus here
    if (contractId) {
      Object.assign(where, {
        contractId,
      });
    }

    if (rentStatus) {
      Object.assign(where, {
        rentStatus,
      });
    }

    return this.rentEntityRepository.find({
      where,
      select: {
        id: true,
        title: true,
      },
    });
  }

  public findOne(
    where: FindOptionsWhere<RentEntity>,
    options?: FindOneOptions<RentEntity>,
  ): Promise<RentEntity | null> {
    return this.rentEntityRepository.findOne({ where, ...options });
  }

  public findOneWithRelations(where: FindOptionsWhere<RentEntity>): Promise<RentEntity | null> {
    const queryBuilder = this.rentEntityRepository.createQueryBuilder("rent");
    queryBuilder.leftJoinAndSelect("rent.contract", "contract");
    queryBuilder.leftJoinAndSelect("contract.merchant", "merchant");
    queryBuilder.leftJoinAndSelect("rent.price", "price");
    queryBuilder.leftJoinAndSelect("price.components", "price_components");
    queryBuilder.leftJoinAndSelect("price_components.contract", "price_contract");
    queryBuilder.leftJoinAndSelect("price_components.template", "price_template");

    queryBuilder.leftJoinAndSelect(
      "price_template.tokens",
      "price_tokens",
      "price_contract.contractType IN(:...tokenTypes)",
      { tokenTypes: [TokenType.NATIVE, TokenType.ERC20, TokenType.ERC1155] },
    );

    queryBuilder.andWhere("rent.id = :id", {
      id: where.id,
    });

    return queryBuilder.getOne();
  }
}
