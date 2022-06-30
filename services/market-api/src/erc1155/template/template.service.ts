import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { IErc1155TemplateSearchDto } from "@framework/types";
import { UniTemplateEntity } from "../../blockchain/uni-token/uni-template/uni-template.entity";

@Injectable()
export class Erc1155TemplateService {
  constructor(
    @InjectRepository(UniTemplateEntity)
    private readonly erc1155TokenEntityRepository: Repository<UniTemplateEntity>,
  ) {}

  public async search(dto: IErc1155TemplateSearchDto): Promise<[Array<UniTemplateEntity>, number]> {
    const { query, skip, take, uniContractIds, minPrice, maxPrice } = dto;

    const queryBuilder = this.erc1155TokenEntityRepository.createQueryBuilder("token");

    queryBuilder.select();
    queryBuilder.leftJoinAndSelect("token.erc1155Collection", "collection");
    queryBuilder.leftJoinAndSelect("token.erc20Token", "erc20_token");

    // search only ACTIVE collections
    queryBuilder.andWhere("contract.contractStatus = 'ACTIVE'");

    if (uniContractIds) {
      if (uniContractIds.length === 1) {
        queryBuilder.andWhere("token.uniContractId = :uniContractId", {
          uniContractId: uniContractIds[0],
        });
      } else {
        queryBuilder.andWhere("token.uniContractId IN(:...uniContractIds)", { uniContractIds });
      }
    }

    if (query) {
      queryBuilder.leftJoin(
        "(SELECT 1)",
        "dummy",
        "TRUE LEFT JOIN LATERAL json_array_elements(token.description->'blocks') blocks ON TRUE",
      );
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where("token.title ILIKE '%' || :title || '%'", { title: query });
          qb.orWhere("blocks->>'text' ILIKE '%' || :description || '%'", { description: query });
        }),
      );
    }

    if (maxPrice) {
      queryBuilder.andWhere("token.price <= :maxPrice", { maxPrice });
    }

    if (minPrice) {
      queryBuilder.andWhere("token.price >= :minPrice", { minPrice });
    }

    queryBuilder.andWhere(
      new Brackets(qb => {
        qb.where("token.amount = 0");
        qb.orWhere("token.amount > token.instanceCount");
      }),
    );

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "token.tokenId": "ASC",
    });

    return queryBuilder.getManyAndCount();
  }

  public findOne(
    where: FindOptionsWhere<UniTemplateEntity>,
    options?: FindOneOptions<UniTemplateEntity>,
  ): Promise<UniTemplateEntity | null> {
    return this.erc1155TokenEntityRepository.findOne({ where, ...options });
  }
}
