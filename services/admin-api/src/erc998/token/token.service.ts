import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { IErc998TokenSearchDto } from "@framework/types";

import { IErc998TokenUpdateDto } from "./interfaces";
import { UniTokenEntity } from "../../uni-token/uni-token.entity";

@Injectable()
export class Erc998TokenService {
  constructor(
    @InjectRepository(UniTokenEntity)
    private readonly uniTokenEntityRepository: Repository<UniTokenEntity>,
  ) {}

  public async search(dto: IErc998TokenSearchDto): Promise<[Array<UniTokenEntity>, number]> {
    const { query, tokenStatus, skip, take, tokenId, rarity, uniContractIds } = dto;

    const queryBuilder = this.uniTokenEntityRepository.createQueryBuilder("token");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("token.erc998Template", "template");

    if (tokenId) {
      queryBuilder.andWhere("token.tokenId = :tokenId", { tokenId });
    }

    if (rarity) {
      if (rarity.length === 1) {
        queryBuilder.andWhere("token.attributes->>'rarity' = :rarity", { rarity: rarity[0] });
      } else {
        queryBuilder.andWhere("token.attributes->>'rarity' IN(:...rarity)", { rarity });
      }
    }

    if (tokenStatus) {
      if (tokenStatus.length === 1) {
        queryBuilder.andWhere("token.tokenStatus = :tokenStatus", { tokenStatus: tokenStatus[0] });
      } else {
        queryBuilder.andWhere("token.tokenStatus IN(:...tokenStatus)", { tokenStatus });
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
      "token.createdAt": "DESC",
    });

    return queryBuilder.getManyAndCount();
  }

  public async autocomplete(): Promise<Array<UniTokenEntity>> {
    const queryBuilder = this.uniTokenEntityRepository.createQueryBuilder("token");

    queryBuilder.select(["id", "tokenId"]);
    queryBuilder.leftJoin("token.template", "template");
    queryBuilder.addSelect(["template.title"]);

    queryBuilder.orderBy({
      "token.createdAt": "DESC",
    });

    return queryBuilder.getMany();
  }

  public findOne(
    where: FindOptionsWhere<UniTokenEntity>,
    options?: FindOneOptions<UniTokenEntity>,
  ): Promise<UniTokenEntity | null> {
    return this.uniTokenEntityRepository.findOne({ where, ...options });
  }

  public async update(where: FindOptionsWhere<UniTokenEntity>, dto: IErc998TokenUpdateDto): Promise<UniTokenEntity> {
    const tokenEntity = await this.findOne(where);

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    Object.assign(tokenEntity, dto);

    return tokenEntity.save();
  }
}
