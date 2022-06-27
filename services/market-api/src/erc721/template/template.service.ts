import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { UniTemplateStatus, IErc721TemplateSearchDto } from "@framework/types";

import { UniTemplateEntity } from "../../uni-token/uni-template.entity";

@Injectable()
export class Erc721TemplateService {
  constructor(
    @InjectRepository(UniTemplateEntity)
    private readonly erc721TemplateEntityRepository: Repository<UniTemplateEntity>,
  ) {}

  public async autocomplete(): Promise<Array<UniTemplateEntity>> {
    return this.erc721TemplateEntityRepository.find({
      select: {
        id: true,
        title: true,
      },
    });
  }

  public async search(dto: IErc721TemplateSearchDto): Promise<[Array<UniTemplateEntity>, number]> {
    const { query, templateStatus, skip, take, erc721CollectionIds, minPrice, maxPrice } = dto;
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

    if (erc721CollectionIds) {
      if (erc721CollectionIds.length === 1) {
        queryBuilder.andWhere("template.erc721CollectionId = :erc721CollectionId", {
          erc721CollectionId: erc721CollectionIds[0],
        });
      } else {
        queryBuilder.andWhere("template.erc721CollectionId IN(:...erc721CollectionIds)", { erc721CollectionIds });
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
    where: FindOptionsWhere<UniTemplateEntity>,
    options?: FindOneOptions<UniTemplateEntity>,
  ): Promise<UniTemplateEntity | null> {
    return this.erc721TemplateEntityRepository.findOne({ where, ...options });
  }

  public async getNewTemplates(): Promise<[Array<UniTemplateEntity>, number]> {
    const queryBuilder = this.erc721TemplateEntityRepository.createQueryBuilder("template");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("template.erc721Collection", "collection");

    queryBuilder.andWhere("template.templateStatus = :templateStatus", {
      templateStatus: UniTemplateStatus.ACTIVE,
    });

    queryBuilder.orderBy({
      "template.createdAt": "DESC",
    });

    queryBuilder.skip(0);
    queryBuilder.take(10);

    return queryBuilder.getManyAndCount();
  }
}
