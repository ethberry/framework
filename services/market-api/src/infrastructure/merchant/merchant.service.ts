import { ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { MerchantStatus } from "@framework/types";
import { ISearchDto } from "@gemunion/types-collection";

import { UserEntity } from "../user/user.entity";
import { MerchantEntity } from "./merchant.entity";
import type { IMerchantCreateDto } from "./interfaces";

@Injectable()
export class MerchantService {
  constructor(
    @InjectRepository(MerchantEntity)
    private readonly merchantEntityRepository: Repository<MerchantEntity>,
  ) {}

  public async search(dto: Partial<ISearchDto>): Promise<[Array<MerchantEntity>, number]> {
    const { query } = dto;

    const queryBuilder = this.merchantEntityRepository.createQueryBuilder("merchant");

    queryBuilder.select();

    queryBuilder.where({ merchantStatus: MerchantStatus.ACTIVE });

    if (query) {
      queryBuilder.leftJoin(
        qb => {
          qb.getQuery = () => `LATERAL json_array_elements(merchant.description->'blocks')`;
          return qb;
        },
        `blocks`,
        `TRUE`,
      );
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where("merchant.title ILIKE '%' || :title || '%'", { title: query });
          qb.orWhere("blocks->>'text' ILIKE '%' || :description || '%'", { description: query });
        }),
      );
    }

    return queryBuilder.getManyAndCount();
  }

  public findOne(
    where: FindOptionsWhere<MerchantEntity>,
    options?: FindOneOptions<MerchantEntity>,
  ): Promise<MerchantEntity | null> {
    return this.merchantEntityRepository.findOne({ where, ...options });
  }

  public async autocomplete(): Promise<Array<MerchantEntity>> {
    return this.merchantEntityRepository.find({
      where: {
        merchantStatus: MerchantStatus.ACTIVE,
      },
      select: {
        id: true,
        title: true,
      },
    });
  }

  public async create(dto: IMerchantCreateDto, userEntity: UserEntity): Promise<MerchantEntity> {
    const { wallet } = dto;

    if (userEntity.merchantId) {
      throw new ConflictException("merchantAlreadyExist");
    }

    const count = await this.count({
      wallet,
    });

    if (count) {
      throw new ConflictException("duplicateAccount");
    }

    return this.merchantEntityRepository
      .create({
        ...dto,
        users: [userEntity],
      })
      .save();
  }

  public count(where: FindOptionsWhere<UserEntity>): Promise<number> {
    return this.merchantEntityRepository.count({ where });
  }
}
