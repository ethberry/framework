import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOptionsWhere, Repository, FindOneOptions } from "typeorm";

import { MerchantStatus } from "@gemunion/framework-types";
import { SearchDto } from "@gemunion/collection";

import { MerchantEntity } from "./merchant.entity";

@Injectable()
export class MerchantService {
  constructor(
    @InjectRepository(MerchantEntity)
    private readonly merchantEntityRepository: Repository<MerchantEntity>,
  ) {}

  public async autocomplete(): Promise<Array<MerchantEntity>> {
    return this.merchantEntityRepository.find({
      where: {
        merchantStatus: MerchantStatus.ACTIVE,
      },
      select: ["id", "title"],
    });
  }

  public findOne(
    where: FindOptionsWhere<MerchantEntity>,
    options?: FindOneOptions<MerchantEntity>,
  ): Promise<MerchantEntity | null> {
    return this.merchantEntityRepository.findOne({ where, ...options });
  }

  public async search(dto: SearchDto): Promise<[Array<MerchantEntity>, number]> {
    const { query } = dto;

    const queryBuilder = this.merchantEntityRepository.createQueryBuilder("merchant");

    queryBuilder.select();

    queryBuilder.where({ merchantStatus: MerchantStatus.ACTIVE });

    // TODO where count(products) > 0

    if (query) {
      queryBuilder.leftJoin(
        "(SELECT 1)",
        "dummy",
        "TRUE LEFT JOIN LATERAL json_array_elements(merchant.description->'blocks') blocks ON TRUE",
      );
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where("merchant.title ILIKE '%' || :title || '%'", { title: query });
          qb.orWhere("blocks->>'text' ILIKE '%' || :description || '%'", { description: query });
        }),
      );
    }

    return queryBuilder.getManyAndCount();
  }
}
