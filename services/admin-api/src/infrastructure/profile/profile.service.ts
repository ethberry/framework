import { Inject, BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { Not } from "typeorm";
import { app } from "firebase-admin";

import type { IMetamaskDto } from "@gemunion/nest-js-module-metamask";
import { MetamaskService } from "@gemunion/nest-js-module-metamask";
import { UserStatus } from "@framework/types";

import { UserEntity } from "../user/user.entity";
import { UserService } from "../user/user.service";
import type { IProfileUpdateDto } from "./interfaces";
import { APP_PROVIDER } from "../auth/auth.constants";

@Injectable()
export class ProfileService {
  constructor(
    @Inject(APP_PROVIDER)
    private readonly admin: app.App,
    private readonly metamaskService: MetamaskService,
    private readonly userService: UserService,
  ) {}

  public async update(userEntity: UserEntity, dto: IProfileUpdateDto): Promise<UserEntity> {
    // UPDATE FIREBASE USER EMAIL
    if (dto.email && dto.email.toString() !== userEntity.email.toLowerCase()) {
      try {
        await this.admin.auth().updateUser(userEntity.sub, { email: dto.email });
      } catch (err) {
        console.error(err.errorInfo, "firebase.updateUser");
      }
    }

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
