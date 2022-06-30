import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, In, Repository } from "typeorm";

import {
  UniTemplateStatus,
  IErc721TemplateAutocompleteDto,
  IErc721TemplateSearchDto,
  TokenType
} from "@framework/types";

import { IErc721TemplateCreateDto, IErc721TemplateUpdateDto } from "./interfaces";
import { UniTemplateEntity } from "../../blockchain/uni-token/uni-template/uni-template.entity";

@Injectable()
export class Erc721TemplateService {
  constructor(
    @InjectRepository(UniTemplateEntity)
    private readonly uniTemplateEntityRepository: Repository<UniTemplateEntity>,
  ) {}

  public async search(dto: IErc721TemplateSearchDto): Promise<[Array<UniTemplateEntity>, number]> {
    const { query, templateStatus, skip, take, uniContractIds } = dto;

    const queryBuilder = this.uniTemplateEntityRepository.createQueryBuilder("template");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("template.uniContract", "contract");
    queryBuilder.andWhere("contract.contractType = :contractType", { contractType: TokenType.ERC721 });

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

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "template.price": "DESC",
    });

    return queryBuilder.getManyAndCount();
  }

  public async autocomplete(dto: IErc721TemplateAutocompleteDto): Promise<Array<UniTemplateEntity>> {
    const { templateStatus = [], uniContractIds = [] } = dto;

    const where = {};

    if (templateStatus.length) {
      Object.assign(where, {
        templateStatus: In(templateStatus),
      });
    }

    if (uniContractIds.length) {
      Object.assign(where, {
        uniContractId: In(uniContractIds),
      });
    }

    return this.uniTemplateEntityRepository.find({
      where,
      select: {
        id: true,
        title: true,
      },
    });
  }

  public findOne(
    where: FindOptionsWhere<UniTemplateEntity>,
    options?: FindOneOptions<UniTemplateEntity>,
  ): Promise<UniTemplateEntity | null> {
    return this.uniTemplateEntityRepository.findOne({ where, ...options });
  }

  public async update(
    where: FindOptionsWhere<UniTemplateEntity>,
    dto: Partial<IErc721TemplateUpdateDto>,
  ): Promise<UniTemplateEntity> {
    const templateEntity = await this.findOne(where);

    if (!templateEntity) {
      throw new NotFoundException("templateNotFound");
    }

    Object.assign(templateEntity, dto);

    return templateEntity.save();
  }

  public async create(dto: IErc721TemplateCreateDto): Promise<UniTemplateEntity> {
    return this.uniTemplateEntityRepository.create(dto).save();
  }

  public async delete(where: FindOptionsWhere<UniTemplateEntity>): Promise<UniTemplateEntity> {
    return this.update(where, { templateStatus: UniTemplateStatus.INACTIVE });
  }
}
