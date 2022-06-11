import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, In, Repository } from "typeorm";

import { Erc721TemplateStatus, IErc721TemplateAutocompleteDto, IErc721TemplateSearchDto } from "@framework/types";

import { Erc721TemplateEntity } from "./template.entity";
import { IErc721TemplateCreateDto, IErc721TemplateUpdateDto } from "./interfaces";

@Injectable()
export class Erc721TemplateService {
  constructor(
    @InjectRepository(Erc721TemplateEntity)
    private readonly erc721TemplateEntityRepository: Repository<Erc721TemplateEntity>,
  ) {}

  public async search(dto: IErc721TemplateSearchDto): Promise<[Array<Erc721TemplateEntity>, number]> {
    const { query, templateStatus, skip, take, erc721CollectionIds } = dto;

    const queryBuilder = this.erc721TemplateEntityRepository.createQueryBuilder("template");

    queryBuilder.select();

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

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "template.price": "DESC",
    });

    return queryBuilder.getManyAndCount();
  }

  public async autocomplete(dto: IErc721TemplateAutocompleteDto): Promise<Array<Erc721TemplateEntity>> {
    const { templateStatus = [], erc721CollectionIds = [] } = dto;

    const where = {};

    if (templateStatus.length) {
      Object.assign(where, {
        templateStatus: In(templateStatus),
      });
    }

    if (erc721CollectionIds.length) {
      Object.assign(where, {
        erc721CollectionId: In(erc721CollectionIds),
      });
    }

    return this.erc721TemplateEntityRepository.find({
      where,
      select: {
        id: true,
        title: true,
      },
    });
  }

  public findOne(
    where: FindOptionsWhere<Erc721TemplateEntity>,
    options?: FindOneOptions<Erc721TemplateEntity>,
  ): Promise<Erc721TemplateEntity | null> {
    return this.erc721TemplateEntityRepository.findOne({ where, ...options });
  }

  public async update(
    where: FindOptionsWhere<Erc721TemplateEntity>,
    dto: Partial<IErc721TemplateUpdateDto>,
  ): Promise<Erc721TemplateEntity> {
    const templateEntity = await this.findOne(where);

    if (!templateEntity) {
      throw new NotFoundException("templateNotFound");
    }

    Object.assign(templateEntity, dto);

    return templateEntity.save();
  }

  public async create(dto: IErc721TemplateCreateDto): Promise<Erc721TemplateEntity> {
    return this.erc721TemplateEntityRepository.create(dto).save();
  }

  public async delete(where: FindOptionsWhere<Erc721TemplateEntity>): Promise<Erc721TemplateEntity> {
    return this.update(where, { templateStatus: Erc721TemplateStatus.INACTIVE });
  }
}
