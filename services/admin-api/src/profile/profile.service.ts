import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientProxy } from "@nestjs/microservices";

import { UserStatus, TokenType, RmqProviderType, EmailType } from "@gemunion/framework-types";

import { UserEntity } from "../user/user.entity";
import { IPasswordUpdateDto, IProfileUpdateDto } from "./interfaces";
import { AuthService } from "../auth/auth.service";
import { UserService } from "../user/user.service";
import { TokenService } from "../token/token.service";

@Injectable()
export class ProfileService {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
    @Inject(RmqProviderType.EML_SERVICE)
    private readonly emailClientProxy: ClientProxy,
  ) {}

  public async update(userEntity: UserEntity, dto: IProfileUpdateDto): Promise<UserEntity | undefined> {
    const { email, ...rest } = dto;

    if (email) {
      await this.userService.checkEmail(email, userEntity.id);
      if (email !== userEntity.email) {
        const tokenEntity = await this.tokenService.getToken(TokenType.EMAIL, userEntity, { email: email });
        const baseUrl = this.configService.get<string>("PUBLIC_FE_URL", "http://localhost:3002");
        this.emailClientProxy.emit(EmailType.EMAIL_VERIFICATION, {
          token: tokenEntity,
          user: Object.assign({}, userEntity, { email }),
          baseUrl,
        });
      }
    }

    Object.assign(userEntity, rest);
    await userEntity.save();

    if (userEntity.userStatus === UserStatus.PENDING) {
      await this.authService.logout({ user: userEntity });
      return;
    }

    return userEntity;
  }

  public async password(userEntity: UserEntity, dto: IPasswordUpdateDto): Promise<void> {
    const { password, current } = dto;

    const user = await this.userService.findOne({
      email: userEntity.email,
      password: current ? this.userService.createPasswordHash(current) : "",
    });

    if (!user) {
      throw new UnauthorizedException("userNotFound");
    }

    if (password) {
      userEntity.password = this.userService.createPasswordHash(password);
      await this.userService.checkPasswordIsDifferent(userEntity.id, userEntity.password);
    }

    await userEntity.save();

    await this.authService.logout({ user: userEntity });
  }
}
