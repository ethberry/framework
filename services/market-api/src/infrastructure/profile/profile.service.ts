import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { Not } from "typeorm";

import type { IMetamaskDto } from "@gemunion/nest-js-module-metamask";
import { MetamaskService } from "@gemunion/nest-js-module-metamask";
import { UserStatus } from "@framework/types";

import { UserEntity } from "../user/user.entity";
import { UserService } from "../user/user.service";
import type { IProfileUpdateDto } from "./interfaces";

@Injectable()
export class ProfileService {
  constructor(
    private readonly metamaskService: MetamaskService,
    private readonly userService: UserService,
  ) {}

  public update(userEntity: UserEntity, dto: IProfileUpdateDto): Promise<UserEntity> {
    Object.assign(userEntity, dto);
    return userEntity.save();
  }

  public async delete(userEntity: UserEntity): Promise<UserEntity> {
    Object.assign(userEntity, { userStatus: UserStatus.INACTIVE, wallet: null });
    return userEntity.save();
  }

  public async attach(userEntity: UserEntity, dto: IMetamaskDto): Promise<UserEntity> {
    const { signature, wallet, nonce } = dto;

    if (!this.metamaskService.isValidSignature({ signature, wallet: wallet.toLowerCase(), nonce })) {
      throw new BadRequestException("signatureDoesNotMatch");
    }

    const count = await this.userService.count({
      wallet,
      id: Not(userEntity.id),
    });

    if (count) {
      throw new ConflictException("duplicateAccount");
    }

    Object.assign(userEntity, { wallet });
    return userEntity.save();
  }

  public detach(userEntity: UserEntity): Promise<UserEntity> {
    Object.assign(userEntity, { wallet: null });
    return userEntity.save();
  }
}
