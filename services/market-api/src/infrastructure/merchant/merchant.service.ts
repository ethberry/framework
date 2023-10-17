import { ConflictException, NotFoundException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { MerchantStatus } from "@framework/types";
import type { ISearchDto } from "@gemunion/types-collection";

import { UserEntity } from "../user/user.entity";
import { MerchantEntity } from "./merchant.entity";
import type { IMerchantCreateDto } from "./interfaces";
import { RmqService } from "./rmq/rmq.service";

@Injectable()
export class MerchantService {
  constructor(
    @InjectRepository(MerchantEntity)
    private readonly merchantEntityRepository: Repository<MerchantEntity>,
    private readonly rmqService: RmqService,
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

    const merchantEntity = await this.merchantEntityRepository
      .create({
        ...dto,
        users: [userEntity],
      })
      .save();

    const merchant = await this.findOne({ id: merchantEntity.id }, { select: { apiKey: true } });

    if (!merchant) {
      throw new NotFoundException("merchantNotFound");
    }

    await this.rmqService.setMerchant(merchant);

    return merchantEntity;
  }

  public count(where: FindOptionsWhere<UserEntity>): Promise<number> {
    return this.merchantEntityRepository.count({ where });
  }
}
