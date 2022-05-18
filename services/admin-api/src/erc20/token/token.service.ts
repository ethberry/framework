import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { Erc20TokenStatus, IErc20TokenSearchDto } from "@framework/types";

import { Erc20TokenEntity } from "./token.entity";
import { IErc20TokenUpdateDto } from "./interfaces";

@Injectable()
export class Erc20TokenService {
  constructor(
    @InjectRepository(Erc20TokenEntity)
    private readonly erc20TokenEntityRepository: Repository<Erc20TokenEntity>,
  ) {}

  public async search(dto: IErc20TokenSearchDto): Promise<[Array<Erc20TokenEntity>, number]> {
    const { query, tokenStatus, skip, take } = dto;

    const queryBuilder = this.erc20TokenEntityRepository.createQueryBuilder("token");

    queryBuilder.select();

    if (tokenStatus) {
      if (tokenStatus.length === 1) {
        queryBuilder.andWhere("token.tokenStatus = :tokenStatus", { tokenStatus: tokenStatus[0] });
      } else {
        queryBuilder.andWhere("token.tokenStatus IN(:...tokenStatus)", { tokenStatus });
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

  public async autocomplete(): Promise<Array<Erc20TokenEntity>> {
    return this.erc20TokenEntityRepository.find({
      select: {
        id: true,
        title: true,
      },
    });
  }

  public findOne(
    where: FindOptionsWhere<Erc20TokenEntity>,
    options?: FindOneOptions<Erc20TokenEntity>,
  ): Promise<Erc20TokenEntity | null> {
    return this.erc20TokenEntityRepository.findOne({ where, ...options });
  }

  public async update(
    where: FindOptionsWhere<Erc20TokenEntity>,
    dto: Partial<IErc20TokenUpdateDto>,
  ): Promise<Erc20TokenEntity> {
    const tokenEntity = await this.findOne(where);

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    Object.assign(tokenEntity, dto);

    return tokenEntity.save();
  }

  public async delete(where: FindOptionsWhere<Erc20TokenEntity>): Promise<Erc20TokenEntity> {
    return this.update(where, { tokenStatus: Erc20TokenStatus.INACTIVE });
  }
}
