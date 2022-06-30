import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, In, Repository } from "typeorm";

import {
  IErc998TemplateAutocompleteDto,
  IErc998TemplateSearchDto,
  TokenType,
  UniTemplateStatus,
} from "@framework/types";

import { IUniTemplateCreateDto, IUniTemplateUpdateDto } from "./interfaces";
import { UniTemplateEntity } from "../../blockchain/uni-token/uni-template/uni-template.entity";

@Injectable()
export class Erc998TemplateService {
  constructor(
    @InjectRepository(UniTemplateEntity)
    private readonly erc998TemplateEntityRepository: Repository<UniTemplateEntity>,
  ) {}

  public async search(dto: IErc998TemplateSearchDto): Promise<[Array<UniTemplateEntity>, number]> {
    const { query, templateStatus, skip, take, uniContractIds } = dto;

    const queryBuilder = this.erc998TemplateEntityRepository.createQueryBuilder("template");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("template.uniContract", "contract");
    queryBuilder.andWhere("contract.contractType = :contractType", { contractType: TokenType.ERC998 });

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

  public async autocomplete(dto: IErc998TemplateAutocompleteDto): Promise<Array<UniTemplateEntity>> {
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

    return this.erc998TemplateEntityRepository.find({
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
    return this.erc998TemplateEntityRepository.findOne({ where, ...options });
  }

  public async update(
    where: FindOptionsWhere<UniTemplateEntity>,
    dto: Partial<IUniTemplateUpdateDto>,
  ): Promise<UniTemplateEntity> {
    const templateEntity = await this.findOne(where);

    if (!templateEntity) {
      throw new NotFoundException("templateNotFound");
    }

    Object.assign(templateEntity, dto);

    return templateEntity.save();
  }

  public async create(dto: IUniTemplateCreateDto): Promise<UniTemplateEntity> {
    return this.erc998TemplateEntityRepository.create(dto).save();
  }

  public async delete(where: FindOptionsWhere<UniTemplateEntity>): Promise<UniTemplateEntity> {
    return this.update(where, { templateStatus: UniTemplateStatus.INACTIVE });
  }
}
