import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { MerchantStatus } from "@framework/types";

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
  ) {}

  public findOne(
    where: FindOptionsWhere<MerchantEntity>,
    options?: FindOneOptions<MerchantEntity>,
  ): Promise<MerchantEntity | null> {
    return this.merchantEntityRepository.findOne({ where, ...options });
  }

  public async update(dto: IMerchantUpdateDto, userEntity: UserEntity): Promise<MerchantEntity | null> {
    Object.assign(userEntity.merchant, dto);

    return userEntity.merchant.save();
  }

  public async delete(where: FindOptionsWhere<MerchantEntity>, userEntity: UserEntity): Promise<MerchantEntity> {
    Object.assign(userEntity.merchant, { merchantStatus: MerchantStatus.INACTIVE });

    await userEntity.merchant.save();

    await this.authService.revokeRefreshTokens(userEntity);

    return userEntity.merchant;
  }
}
