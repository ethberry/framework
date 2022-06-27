import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, In, Repository } from "typeorm";

import { UniTemplateStatus, IErc1155TemplateAutocompleteDto, IErc1155TemplateSearchDto } from "@framework/types";
import { ns } from "@framework/constants";

import { IErc1155TemplateCreateDto, IErc1155TemplateUpdateDto } from "./interfaces";
import { UniTemplateEntity } from "../../uni-token/uni-template.entity";

@Injectable()
export class Erc1155TemplateService {
  constructor(
    @InjectRepository(UniTemplateEntity)
    private readonly erc1155TokenEntityRepository: Repository<UniTemplateEntity>,
  ) {}

  public async search(dto: IErc1155TemplateSearchDto): Promise<[Array<UniTemplateEntity>, number]> {
    const { query, skip, take, uniContractIds, templateStatus } = dto;

    const queryBuilder = this.erc1155TokenEntityRepository.createQueryBuilder("token");

    queryBuilder.select();

    if (uniContractIds) {
      if (uniContractIds.length === 1) {
        queryBuilder.andWhere("token.uniContractId = :uniContractId", {
          uniContractId: uniContractIds[0],
        });
      } else {
        queryBuilder.andWhere("token.uniContractId IN(:...uniContractIds)", { uniContractIds });
      }
    }

    if (templateStatus) {
      if (templateStatus.length === 1) {
        queryBuilder.andWhere("token.templateStatus = :templateStatus", {
          tokenStatus: templateStatus[0],
        });
      } else {
        queryBuilder.andWhere("token.templateStatus IN(:...templateStatus)", { templateStatus });
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

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "token.createdAt": "DESC",
    });

    return queryBuilder.getManyAndCount();
  }

  public async autocomplete(dto: IErc1155TemplateAutocompleteDto): Promise<Array<UniTemplateEntity>> {
    const { templateStatus = [], uniContractIds = [] } = dto;

    const where = {};

    if (templateStatus.length) {
      Object.assign(where, {
        tokenStatus: In(templateStatus),
      });
    }

    if (uniContractIds.length) {
      Object.assign(where, {
        uniContractIds: In(uniContractIds),
      });
    }

    return this.erc1155TokenEntityRepository.find({
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
    return this.erc1155TokenEntityRepository.findOne({ where, ...options });
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

    const result: Array<{ tokenId: number }> = await this.erc1155TokenEntityRepository.query(queryString, [
      collectionId,
    ]);

    return result[0].tokenId;
  }

  public async create(dto: IErc1155TemplateCreateDto): Promise<UniTemplateEntity> {
    const maxTokenId = await this.getMaxTokenIdForCollection(dto.erc1155CollectionId);

    return this.erc1155TokenEntityRepository
      .create({
        // tokenId: (maxTokenId + 1).toString(),
        ...dto,
      })
      .save();
  }

  public async update(
    where: FindOptionsWhere<UniTemplateEntity>,
    dto: Partial<IErc1155TemplateUpdateDto>,
  ): Promise<UniTemplateEntity> {
    const tokenEntity = await this.findOne(where);

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    Object.assign(tokenEntity, dto);

    return tokenEntity.save();
  }

  public async delete(where: FindOptionsWhere<UniTemplateEntity>): Promise<UniTemplateEntity> {
    return this.update(where, { templateStatus: UniTemplateStatus.INACTIVE });
  }
}
