import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { IErc721TemplateSearchDto } from "@framework/types";

import { TemplateEntity } from "../../blockchain/hierarchy/template/template.entity";

@Injectable()
export class Erc721TemplateService {
  constructor(
    @InjectRepository(TemplateEntity)
    private readonly erc721TemplateEntityRepository: Repository<TemplateEntity>,
  ) {}

  public async autocomplete(): Promise<Array<TemplateEntity>> {
    return this.erc721TemplateEntityRepository.find({
      select: {
        id: true,
        title: true,
      },
    });
  }

  public async search(dto: IErc721TemplateSearchDto): Promise<[Array<TemplateEntity>, number]> {
    const { query, templateStatus, skip, take, contractIds, minPrice, maxPrice } = dto;
    const queryBuilder = this.erc721TemplateEntityRepository.createQueryBuilder("template");

    queryBuilder.select();
    queryBuilder.leftJoinAndSelect("template.erc721Collection", "collection");
    queryBuilder.leftJoinAndSelect("template.erc20Token", "erc20_token");

    if (templateStatus) {
      if (templateStatus.length === 1) {
        queryBuilder.andWhere("template.templateStatus = :templateStatus", { templateStatus: templateStatus[0] });
      } else {
        queryBuilder.andWhere("template.templateStatus IN(:...templateStatus)", { templateStatus });
      }
    }

    if (contractIds) {
      if (contractIds.length === 1) {
        queryBuilder.andWhere("template.contractId = :contractId", {
          contractId: contractIds[0],
        });
      } else {
        queryBuilder.andWhere("template.contractId IN(:...contractIds)", { contractIds });
      }
    }

    if (query) {
      queryBuilder.leftJoin(
        "(SELECT 1)",
        "dummy",
        "TRUE LEFT JOIN LATERAL json_array_elements(template.description->'blocks') blocks ON TRUE",
      );
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where("template.title ILIKE '%' || :title || '%'", { title: query });
          qb.orWhere("blocks->>'text' ILIKE '%' || :description || '%'", { description: query });
        }),
      );
    }

    if (maxPrice) {
      queryBuilder.andWhere("template.price <= :maxPrice", { maxPrice });
    }

    if (minPrice) {
      queryBuilder.andWhere("template.price >= :minPrice", { minPrice });
    }

    queryBuilder.andWhere(
      new Brackets(qb => {
        qb.where("template.amount = 0");
        qb.orWhere("template.amount > template.instanceCount");
      }),
    );

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    // TODO better sort
    queryBuilder.orderBy({
      "template.createdAt": "DESC",
    });

    return queryBuilder.getManyAndCount();
  }

  public findOne(
    where: FindOptionsWhere<TemplateEntity>,
    options?: FindOneOptions<TemplateEntity>,
  ): Promise<TemplateEntity | null> {
    return this.erc721TemplateEntityRepository.findOne({ where, ...options });
  }
}
