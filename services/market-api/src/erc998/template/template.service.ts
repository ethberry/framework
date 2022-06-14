import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { Erc998TemplateStatus, IErc998TemplateSearchDto } from "@framework/types";

import { Erc998TemplateEntity } from "./template.entity";

@Injectable()
export class Erc998TemplateService {
  constructor(
    @InjectRepository(Erc998TemplateEntity)
    private readonly erc998TemplateEntityRepository: Repository<Erc998TemplateEntity>,
  ) {}

  public async autocomplete(): Promise<Array<Erc998TemplateEntity>> {
    return this.erc998TemplateEntityRepository.find({
      select: {
        id: true,
        title: true,
      },
    });
  }

  public async search(dto: IErc998TemplateSearchDto): Promise<[Array<Erc998TemplateEntity>, number]> {
    const { query, templateStatus, skip, take, erc998CollectionIds, minPrice, maxPrice } = dto;
    const queryBuilder = this.erc998TemplateEntityRepository.createQueryBuilder("template");

    queryBuilder.select();
    queryBuilder.leftJoinAndSelect("template.erc998Collection", "collection");

    if (templateStatus) {
      if (templateStatus.length === 1) {
        queryBuilder.andWhere("template.templateStatus = :templateStatus", { templateStatus: templateStatus[0] });
      } else {
        queryBuilder.andWhere("template.templateStatus IN(:...templateStatus)", { templateStatus });
      }
    }

    if (erc998CollectionIds) {
      if (erc998CollectionIds.length === 1) {
        queryBuilder.andWhere("template.erc998CollectionId = :erc998CollectionId", {
          erc998CollectionId: erc998CollectionIds[0],
        });
      } else {
        queryBuilder.andWhere("template.erc998CollectionId IN(:...erc998CollectionIds)", { erc998CollectionIds });
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
    where: FindOptionsWhere<Erc998TemplateEntity>,
    options?: FindOneOptions<Erc998TemplateEntity>,
  ): Promise<Erc998TemplateEntity | null> {
    return this.erc998TemplateEntityRepository.findOne({ where, ...options });
  }

  public async getNewTemplates(): Promise<[Array<Erc998TemplateEntity>, number]> {
    const queryBuilder = this.erc998TemplateEntityRepository.createQueryBuilder("template");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("template.erc998Collection", "collection");

    queryBuilder.andWhere("template.templateStatus = :templateStatus", {
      templateStatus: Erc998TemplateStatus.ACTIVE,
    });

    queryBuilder.orderBy({
      "template.createdAt": "DESC",
    });

    queryBuilder.skip(0);
    queryBuilder.take(10);

    return queryBuilder.getManyAndCount();
  }
}
