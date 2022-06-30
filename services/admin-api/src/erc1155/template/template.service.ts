import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, In, Repository } from "typeorm";

import {
  IErc1155TemplateAutocompleteDto,
  IErc1155TemplateSearchDto,
  TokenType,
  TemplateStatus,
} from "@framework/types";
import { ns } from "@framework/constants";

import { IErc1155TemplateCreateDto, IErc1155TemplateUpdateDto } from "./interfaces";
import { TemplateEntity } from "../../blockchain/hierarchy/template/template.entity";

@Injectable()
export class Erc1155TemplateService {
  constructor(
    @InjectRepository(TemplateEntity)
    private readonly erc1155TemplateEntityRepository: Repository<TemplateEntity>,
  ) {}

  public async search(dto: IErc1155TemplateSearchDto): Promise<[Array<TemplateEntity>, number]> {
    const { query, skip, take, contractIds, templateStatus } = dto;

    const queryBuilder = this.erc1155TemplateEntityRepository.createQueryBuilder("template");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("template.contract", "contract");
    queryBuilder.andWhere("contract.contractType = :contractType", { contractType: TokenType.ERC1155 });

    if (contractIds) {
      if (contractIds.length === 1) {
        queryBuilder.andWhere("template.contractId = :contractId", {
          contractId: contractIds[0],
        });
      } else {
        queryBuilder.andWhere("template.contractId IN(:...contractIds)", { contractIds });
      }
    }

    if (templateStatus) {
      if (templateStatus.length === 1) {
        queryBuilder.andWhere("template.templateStatus = :templateStatus", {
          templateStatus: templateStatus[0],
        });
      } else {
        queryBuilder.andWhere("template.templateStatus IN(:...templateStatus)", { templateStatus });
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
      "template.createdAt": "DESC",
    });

    return queryBuilder.getManyAndCount();
  }

  public async autocomplete(dto: IErc1155TemplateAutocompleteDto): Promise<Array<TemplateEntity>> {
    const { templateStatus = [], contractIds = [] } = dto;

    const where = {};

    if (templateStatus.length) {
      Object.assign(where, {
        tokenStatus: In(templateStatus),
      });
    }

    if (contractIds.length) {
      Object.assign(where, {
        contractIds: In(contractIds),
      });
    }

    return this.erc1155TemplateEntityRepository.find({
      where,
      select: {
        id: true,
        title: true,
      },
    });
  }

  public findOne(
    where: FindOptionsWhere<TemplateEntity>,
    options?: FindOneOptions<TemplateEntity>,
  ): Promise<TemplateEntity | null> {
    return this.erc1155TemplateEntityRepository.findOne({ where, ...options });
  }

  public async getMaxTokenIdForCollection(collectionId: number): Promise<number> {
    const queryString = `
      select
        coalesce(max(token_id::integer), 0) as "tokenId"
      from
        ${ns}.erc1155_token
      where
        erc1155_collection_id = $1
    `;

    const result: Array<{ tokenId: number }> = await this.erc1155TemplateEntityRepository.query(queryString, [
      collectionId,
    ]);

    return result[0].tokenId;
  }

  public async create(dto: IErc1155TemplateCreateDto): Promise<TemplateEntity> {
    const _maxTokenId = await this.getMaxTokenIdForCollection(dto.erc1155CollectionId);

    return this.erc1155TemplateEntityRepository
      .create({
        // tokenId: (maxTokenId + 1).toString(),
        ...dto,
      })
      .save();
  }

  public async update(
    where: FindOptionsWhere<TemplateEntity>,
    dto: Partial<IErc1155TemplateUpdateDto>,
  ): Promise<TemplateEntity> {
    const tokenEntity = await this.findOne(where);

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    Object.assign(tokenEntity, dto);

    return tokenEntity.save();
  }

  public async delete(where: FindOptionsWhere<TemplateEntity>): Promise<TemplateEntity> {
    return this.update(where, { templateStatus: TemplateStatus.INACTIVE });
  }
}
