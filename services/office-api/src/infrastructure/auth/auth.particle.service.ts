import { ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { app } from "firebase-admin";

import type { IParticleDto, IFirebaseToken } from "@ethberry/nest-js-module-particle";
import { ParticleService } from "@ethberry/nest-js-module-particle";
import { UserRole } from "@framework/types";

import { UserService } from "../user/user.service";
import { APP_PROVIDER } from "./auth.constants";

@Injectable()
export class AuthParticleService {
  constructor(
    @Inject(APP_PROVIDER)
    private readonly admin: app.App,
    private readonly userService: UserService,
    private readonly particleService: ParticleService,
  ) {}

  public async login(dto: IParticleDto): Promise<IFirebaseToken> {
    const { nonce, signature, wallet } = dto;

    if (!this.particleService.isValidSignature({ signature, wallet, nonce })) {
      throw new ForbiddenException("signatureDoesNotMatch");
    }

    const userEntity = await this.userService.findOne({ wallet: wallet.toLowerCase() });

    if (!userEntity) {
      throw new ForbiddenException("userNotFound");
    }

    const roles = [UserRole.SUPER, UserRole.ADMIN, UserRole.OWNER, UserRole.MANAGER];
    if (!userEntity.userRoles.some(role => roles.includes(role))) {
      throw new ForbiddenException("userHasWrongRole");
    }

    const token = await this.admin.auth().createCustomToken(userEntity.sub);

    return { token };
  }
}
