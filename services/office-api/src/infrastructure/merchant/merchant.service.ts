import { ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository, UpdateResult } from "typeorm";

import type { IMerchantSearchDto } from "@framework/types";
import { MerchantStatus, UserRole } from "@framework/types";

import { AuthService } from "../auth/auth.service";
import { UserEntity } from "../user/user.entity";
import { UserService } from "../user/user.service";
import { MerchantEntity } from "./merchant.entity";
import type { IMerchantUpdateDto } from "./interfaces";

@Injectable()
export class MerchantService {
  constructor(
    @InjectRepository(MerchantEntity)
    private readonly merchantEntityRepository: Repository<MerchantEntity>,
    private readonly authService: AuthService,
    private readonly userService: UserService,
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
    const { wallet, ...rest } = dto;

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

    if (merchantEntity.merchantStatus === MerchantStatus.PENDING) {
      merchantEntity.merchantStatus = MerchantStatus.ACTIVE;

      await this.userService.addRole({ merchantId: merchantEntity.id }, UserRole.ADMIN);
    }

    Object.assign(merchantEntity, rest);
    return merchantEntity.save();
  }

  public async delete(where: FindOptionsWhere<MerchantEntity>, userEntity: UserEntity): Promise<MerchantEntity> {
    const merchantEntity = await this.findOne(where);

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

  public count(where: FindOptionsWhere<MerchantEntity>): Promise<number> {
    return this.merchantEntityRepository.count({ where });
  }

  public searchUsers(userEntity: UserEntity): Promise<Array<UserEntity>> {
    return this.userService.findAll({ merchantId: userEntity.merchantId });
  }

  public async removeUser(where: FindOptionsWhere<MerchantEntity>, userEntity: UserEntity): Promise<UpdateResult> {
    const userEntity2 = await this.userService.findOne(where);

    if (!userEntity2) {
      throw new NotFoundException("userNotFound");
    }

    if (userEntity2.merchantId !== userEntity.merchantId) {
      throw new ForbiddenException("insufficientPermissions");
    }

    // TODO multiple admins
    return this.userService.removeRole(where, UserRole.MANAGER);
  }
}
