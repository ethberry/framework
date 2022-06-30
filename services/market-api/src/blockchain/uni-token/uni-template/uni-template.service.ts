import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, Repository } from "typeorm";

import { UniTemplateEntity } from "./uni-template.entity";
import { IUniTemplateSearchDto, UniTemplateStatus } from "@framework/types";
import { ITemplateNewDto } from "./interfaces";

@Injectable()
export class UniTemplateService {
  constructor(
    @InjectRepository(UniTemplateEntity)
    private readonly uniTemplateEntityRepository: Repository<UniTemplateEntity>,
  ) {}

  public async search(dto: IUniTemplateSearchDto): Promise<[Array<UniTemplateEntity>, number]> {
    const { query, templateStatus, skip, take, uniContractIds, minPrice, maxPrice } = dto;
    const queryBuilder = this.uniTemplateEntityRepository.createQueryBuilder("template");

    queryBuilder.select();
    queryBuilder.leftJoinAndSelect("template.uniContract", "contract");

    if (templateStatus) {
      if (templateStatus.length === 1) {
        queryBuilder.andWhere("template.templateStatus = :templateStatus", { templateStatus: templateStatus[0] });
      } else {
        queryBuilder.andWhere("template.templateStatus IN(:...templateStatus)", { templateStatus });
      }
    }

    if (uniContractIds) {
      if (uniContractIds.length === 1) {
        queryBuilder.andWhere("template.uniContractId = :uniContractId", {
          uniContractId: uniContractIds[0],
        });
      } else {
        queryBuilder.andWhere("template.uniContractId IN(:...uniContractIds)", { uniContractIds });
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

  public async autocomplete(): Promise<Array<UniTemplateEntity>> {
    return this.uniTemplateEntityRepository.find({
      select: {
        id: true,
        title: true,
      },
    });
  }

  public async getNewTemplates(dto: ITemplateNewDto): Promise<[Array<UniTemplateEntity>, number]> {
    const { tokenType } = dto;

    const queryBuilder = this.uniTemplateEntityRepository.createQueryBuilder("template");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("template.uniContract", "contract");

    if (tokenType) {
      queryBuilder.andWhere("contract.contractType = :contractType", {
        contractType: tokenType,
      });
    }

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
