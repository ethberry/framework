import { ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository, UpdateResult } from "typeorm";

import { MerchantStatus, UserRole } from "@framework/types";

import { UserService } from "../user/user.service";
import { UserEntity } from "../user/user.entity";
import { AuthService } from "../auth/auth.service";
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

  public findOne(
    where: FindOptionsWhere<MerchantEntity>,
    options?: FindOneOptions<MerchantEntity>,
  ): Promise<MerchantEntity | null> {
    return this.merchantEntityRepository.findOne({ where, ...options });
  }

  public async update(dto: IMerchantUpdateDto, userEntity: UserEntity): Promise<MerchantEntity | null> {
    const { wallet } = dto;

    if (wallet) {
      const count = await this.count({
        wallet,
      });

      if (count) {
        throw new ConflictException("duplicateAccount");
      }
    }

    Object.assign(userEntity.merchant, dto);

    return userEntity.merchant.save();
  }

  public async delete(userEntity: UserEntity): Promise<MerchantEntity> {
    const merchantEntity = userEntity.merchant;

    Object.assign(merchantEntity, { merchantStatus: MerchantStatus.INACTIVE });

    await merchantEntity.save();

    await this.authService.revokeRefreshTokens(userEntity);

    return merchantEntity;
  }

  public count(where: FindOptionsWhere<MerchantEntity>): Promise<number> {
    return this.merchantEntityRepository.count({ where });
  }

  public searchUsers(userEntity: UserEntity): Promise<[Array<UserEntity>, number]> {
    return this.userService.findAndCount({ merchantId: userEntity.merchantId });
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
