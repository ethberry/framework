import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, In, Repository } from "typeorm";

import { Erc998TemplateStatus, IErc998TemplateAutocompleteDto, IErc998TemplateSearchDto } from "@framework/types";

import { Erc998TemplateEntity } from "./template.entity";
import { IErc998TemplateCreateDto, IErc998TemplateUpdateDto } from "./interfaces";

@Injectable()
export class Erc998TemplateService {
  constructor(
    @InjectRepository(Erc998TemplateEntity)
    private readonly erc998TemplateEntityRepository: Repository<Erc998TemplateEntity>,
  ) {}

  public async search(dto: IErc998TemplateSearchDto): Promise<[Array<Erc998TemplateEntity>, number]> {
    const { query, templateStatus, skip, take, erc998CollectionIds } = dto;

    const queryBuilder = this.erc998TemplateEntityRepository.createQueryBuilder("template");

    queryBuilder.select();

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

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "template.price": "DESC",
    });

    return queryBuilder.getManyAndCount();
  }

  public async autocomplete(dto: IErc998TemplateAutocompleteDto): Promise<Array<Erc998TemplateEntity>> {
    const { templateStatus = [], erc998CollectionIds = [] } = dto;

    const where = {};

    if (templateStatus.length) {
      Object.assign(where, {
        templateStatus: In(templateStatus),
      });
    }

    if (erc998CollectionIds.length) {
      Object.assign(where, {
        erc998CollectionId: In(erc998CollectionIds),
      });
    }

    return this.erc998TemplateEntityRepository.find({
      where,
      select: {
        id: true,
        title: true,
      },
    });
  }

  public findOne(
    where: FindOptionsWhere<Erc998TemplateEntity>,
    options?: FindOneOptions<Erc998TemplateEntity>,
  ): Promise<Erc998TemplateEntity | null> {
    return this.erc998TemplateEntityRepository.findOne({ where, ...options });
  }

  public async update(
    where: FindOptionsWhere<Erc998TemplateEntity>,
    dto: Partial<IErc998TemplateUpdateDto>,
  ): Promise<Erc998TemplateEntity> {
    const templateEntity = await this.findOne(where);

    if (!templateEntity) {
      throw new NotFoundException("templateNotFound");
    }

    Object.assign(templateEntity, dto);

    return templateEntity.save();
  }

  public async create(dto: IErc998TemplateCreateDto): Promise<Erc998TemplateEntity> {
    return this.erc998TemplateEntityRepository.create(dto).save();
  }

  public async delete(where: FindOptionsWhere<Erc998TemplateEntity>): Promise<Erc998TemplateEntity> {
    return this.update(where, { templateStatus: Erc998TemplateStatus.INACTIVE });
  }
}
