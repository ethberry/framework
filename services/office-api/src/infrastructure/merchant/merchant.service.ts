import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import type { IMerchantSearchDto } from "@framework/types";
import { MerchantStatus } from "@framework/types";

import { AuthService } from "../auth/auth.service";
import { MerchantEntity } from "./merchant.entity";
import type { IMerchantCreateDto, IMerchantUpdateDto } from "./interfaces";
import { UserEntity } from "../user/user.entity";

@Injectable()
export class MerchantService {
  constructor(
    @InjectRepository(MerchantEntity)
    private readonly merchantEntityRepository: Repository<MerchantEntity>,
    private readonly authService: AuthService,
  ) {}

  public search(dto: IMerchantSearchDto): Promise<[Array<MerchantEntity>, number]> {
    const { merchantStatus, query, skip, take } = dto;

    const queryBuilder = this.merchantEntityRepository.createQueryBuilder("merchant");

    queryBuilder.select();

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

    if (merchantStatus && merchantStatus.length) {
      if (merchantStatus.length === 1) {
        queryBuilder.andWhere("merchant.merchantStatus = :merchantStatus", { merchantStatus: merchantStatus[0] });
      } else {
        queryBuilder.andWhere("merchant.merchantStatus IN(:...merchantStatus)", { merchantStatus });
      }
    }

    queryBuilder.leftJoinAndSelect("merchant.users", "user");

    queryBuilder.orderBy("merchant.createdAt", "DESC");

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    return queryBuilder.getManyAndCount();
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

  public findOne(
    where: FindOptionsWhere<MerchantEntity>,
    options?: FindOneOptions<MerchantEntity>,
  ): Promise<MerchantEntity | null> {
    return this.merchantEntityRepository.findOne({ where, ...options });
  }

  public async update(
    where: FindOptionsWhere<MerchantEntity>,
    dto: IMerchantUpdateDto,
  ): Promise<MerchantEntity | null> {
    const { userIds, wallet, ...rest } = dto;

    const merchantEntity = await this.merchantEntityRepository.findOne({ where });

    if (!merchantEntity) {
      throw new NotFoundException("merchantNotFound");
    }

    if (wallet) {
      const count = await this.count({
        wallet,
      });

      if (count) {
        throw new ConflictException("duplicateAccount");
      }
    }

    Object.assign(merchantEntity, rest);

    if (userIds.length) {
      Object.assign(merchantEntity, {
        users: userIds.map(id => ({ id })),
      });
    }

    return merchantEntity.save();
  }

  public async create(dto: IMerchantCreateDto): Promise<MerchantEntity> {
    const { userIds, ...rest } = dto;

    return this.merchantEntityRepository
      .create({
        ...rest,
        merchantStatus: MerchantStatus.ACTIVE,
        users: userIds.map(id => ({ id })),
      })
      .save();
  }

  public async delete(where: FindOptionsWhere<MerchantEntity>, userEntity: UserEntity): Promise<MerchantEntity | null> {
    const merchantEntity = await this.merchantEntityRepository.findOne({ where });

    if (!merchantEntity) {
      throw new NotFoundException("merchantNotFound");
    }

    Object.assign(merchantEntity, { merchantStatus: MerchantStatus.INACTIVE });

    await merchantEntity.save();

    if (merchantEntity.id === userEntity.merchantId) {
      await this.authService.revokeRefreshTokens(userEntity);
    }

    return merchantEntity;
  }

  public count(where: FindOptionsWhere<UserEntity>): Promise<number> {
    return this.merchantEntityRepository.count({ where });
  }
}
