import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, In, Repository } from "typeorm";

import {
  Erc20TokenStatus,
  IErc20TokenAutocompleteDto,
  IErc20TokenCreateDto,
  IErc20TokenSearchDto,
} from "@framework/types";

import { Erc20TokenEntity } from "./token.entity";
import { IErc20TokenUpdateDto } from "./interfaces";

@Injectable()
export class Erc20TokenService {
  constructor(
    @InjectRepository(Erc20TokenEntity)
    private readonly erc20TokenEntityRepository: Repository<Erc20TokenEntity>,
    private readonly configService: ConfigService,
  ) {}

  public async search(dto: IErc20TokenSearchDto): Promise<[Array<Erc20TokenEntity>, number]> {
    const { query, tokenStatus, contractTemplate, skip, take } = dto;

    const queryBuilder = this.erc20TokenEntityRepository.createQueryBuilder("token");

    queryBuilder.select();

    if (tokenStatus) {
      if (tokenStatus.length === 1) {
        queryBuilder.andWhere("token.tokenStatus = :tokenStatus", { tokenStatus: tokenStatus[0] });
      } else {
        queryBuilder.andWhere("token.tokenStatus IN(:...tokenStatus)", { tokenStatus });
      }
    }

    if (contractTemplate) {
      if (contractTemplate.length === 1) {
        queryBuilder.andWhere("token.contractTemplate = :contractTemplate", { contractTemplate: contractTemplate[0] });
      } else {
        queryBuilder.andWhere("token.contractTemplate IN(:...contractTemplate)", { contractTemplate });
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

  public async autocomplete(dto: IErc20TokenAutocompleteDto): Promise<Array<Erc20TokenEntity>> {
    const { contractTemplate = [] } = dto;

    const where = {
      tokenStatus: Erc20TokenStatus.ACTIVE,
    };

    if (contractTemplate.length) {
      Object.assign(where, {
        contractTemplate: In(contractTemplate),
      });
    }

    return this.erc20TokenEntityRepository.find({
      where,
      select: {
        id: true,
        title: true,
        contractTemplate: true,
      },
    });
  }

  public findOne(
    where: FindOptionsWhere<Erc20TokenEntity>,
    options?: FindOneOptions<Erc20TokenEntity>,
  ): Promise<Erc20TokenEntity | null> {
    return this.erc20TokenEntityRepository.findOne({ where, ...options });
  }

  public create(dto: IErc20TokenCreateDto): Promise<Erc20TokenEntity> {
    const chainId = ~~this.configService.get<string>("CHAIN_ID", "1337");
    return this.erc20TokenEntityRepository
      .create({
        ...dto,
        name: dto.symbol,
        tokenStatus: Erc20TokenStatus.ACTIVE,
        amount: "0",
        chainId,
      })
      .save();
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
