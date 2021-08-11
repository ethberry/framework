import { Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, FindConditions, Repository } from "typeorm";
import { v4 } from "uuid";
import zxcvbn from "zxcvbn";

import { EmailType, ProviderType, TokenType, UserRole, UserStatus } from "@gemunionstudio/framework-types";
import { IJwt } from "@gemunionstudio/framework-types/dist/jwt";

import { UserService } from "../user/user.service";
import { UserEntity } from "../user/user.entity";
import {
  IEmailVerificationDto,
  IForgotPasswordDto,
  ILoginDto,
  IPasswordScoreDto,
  IPasswordScoreResult,
  IResendEmailVerificationDto,
  IRestorePasswordDto,
} from "./interfaces";
import { AuthEntity } from "./auth.entity";
import { IUserCreateDto } from "../user/interfaces";
import { TokenService } from "../token/token.service";
import { IUserImportDto } from "../user/interfaces/import";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthEntity)
    private readonly authEntityRepository: Repository<AuthEntity>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
    @Inject(ProviderType.EMAIL_SERVICE)
    private readonly emailClientProxy: ClientProxy,
  ) {}

  public async login(data: ILoginDto, ip: string): Promise<IJwt> {
    const userEntity = await this.userService.getByCredentials(data.email, data.password);

    if (!userEntity) {
      throw new UnauthorizedException("userNotFound");
    }

    if (userEntity.userStatus !== UserStatus.ACTIVE) {
      throw new UnauthorizedException("userIsNotActive");
    }

    const roles = [UserRole.ADMIN, UserRole.MERCHANT];
    if (!userEntity.userRoles.some(role => roles.includes(role))) {
      throw new UnauthorizedException("userHasWrongRole");
    }

    return this.loginUser(userEntity, ip);
  }

  public async logout(where: FindConditions<AuthEntity>): Promise<DeleteResult> {
    return this.authEntityRepository.delete(where);
  }

  public async refresh(where: FindConditions<AuthEntity>, ip: string): Promise<IJwt> {
    const authEntity = await this.authEntityRepository.findOne({ where, relations: ["user"] });

    if (!authEntity || authEntity.refreshTokenExpiresAt < new Date().getTime()) {
      throw new UnauthorizedException("refreshTokenHasExpired");
    }

    return this.loginUser(authEntity.user, ip);
  }

  public async loginUser(userEntity: UserEntity, ip: string): Promise<IJwt> {
    const refreshToken = v4();
    const date = new Date();

    // it is actually a string
    const accessTokenExpiresIn = ~~this.configService.get<number>("JWT_ACCESS_TOKEN_EXPIRES_IN", 5 * 60);
    const refreshTokenExpiresIn = ~~this.configService.get<number>("JWT_REFRESH_TOKEN_EXPIRES_IN", 30 * 24 * 60 * 60);

    await this.authEntityRepository
      .create({
        user: userEntity,
        refreshToken,
        refreshTokenExpiresAt: date.getTime() + refreshTokenExpiresIn * 1000,
        ip,
      })
      .save();

    return {
      accessToken: this.jwtService.sign({ email: userEntity.email }, { expiresIn: accessTokenExpiresIn }),
      refreshToken: refreshToken,
      accessTokenExpiresAt: date.getTime() + accessTokenExpiresIn * 1000,
      refreshTokenExpiresAt: date.getTime() + refreshTokenExpiresIn * 1000,
    };
  }

  public async signup(data: IUserCreateDto): Promise<UserEntity> {
    const userEntity = await this.userService.create(data);

    const baseUrl = this.configService.get<string>("PUBLIC_FE_URL", "http://localhost:3005");

    // this.emailClientProxy.emit(EmailType.WELCOME, {
    //   user: userEntity,
    //   baseUrl,
    // });

    const tokenEntity = await this.tokenService.getToken(TokenType.EMAIL, userEntity);

    this.emailClientProxy.emit(EmailType.EMAIL_VERIFICATION, {
      token: tokenEntity,
      user: userEntity,
      baseUrl,
    });

    return userEntity;
  }

  public async import(data: IUserImportDto): Promise<UserEntity> {
    const userEntity = await this.userService.import(data);

    const baseUrl = this.configService.get<string>("PUBLIC_FE_URL", "http://localhost:3005");

    // this.emailClientProxy.emit(EmailType.WELCOME, {
    //   user: userEntity,
    //   baseUrl,
    // });

    if (data.userStatus === UserStatus.PENDING) {
      const tokenEntity = await this.tokenService.getToken(TokenType.EMAIL, userEntity);

      this.emailClientProxy.emit(EmailType.EMAIL_VERIFICATION, {
        token: tokenEntity,
        user: userEntity,
        baseUrl,
      });
    }

    return userEntity;
  }

  public async forgotPassword(data: IForgotPasswordDto): Promise<void> {
    const userEntity = await this.userService.findOne({ email: data.email });

    if (!userEntity) {
      // if user is not found - return positive status
      return;
    }

    if (userEntity.userStatus !== UserStatus.ACTIVE) {
      throw new UnauthorizedException("userIsNotActive");
    }

    const tokenEntity = await this.tokenService.getToken(TokenType.PASSWORD, userEntity);

    const baseUrl = this.configService.get<string>("PUBLIC_FE_URL", "http://localhost:3005");

    this.emailClientProxy.emit(EmailType.FORGOT_PASSWORD, {
      token: tokenEntity,
      user: userEntity,
      baseUrl,
    });
  }

  public async restorePassword(data: IRestorePasswordDto): Promise<void> {
    const tokenEntity = await this.tokenService.findOne({ uuid: data.token, tokenType: TokenType.PASSWORD });

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    await this.userService.updatePassword(tokenEntity.user, data);

    // const baseUrl = this.configService.get<string>("PUBLIC_FE_URL", "http://localhost:3005");

    // this.emailClientProxy.emit(EmailType.RESTORE_PASSWORD, {
    //   user: tokenEntity.user,
    //   baseUrl,
    // });

    // delete token from db
    await tokenEntity.remove();
  }

  public async emailVerification(data: IEmailVerificationDto): Promise<void> {
    const tokenEntity = await this.tokenService.findOne({ uuid: data.token, tokenType: TokenType.EMAIL });

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    await this.userService.activate(tokenEntity.user);
    // delete token from db
    await tokenEntity.remove();
  }

  public async resendEmailVerification(data: IResendEmailVerificationDto): Promise<void> {
    const userEntity = await this.userService.findOne({ email: data.email });

    if (!userEntity) {
      // if user is not found - return positive status
      return;
    }

    const tokenEntity = await this.tokenService.getToken(TokenType.EMAIL, userEntity);

    const baseUrl = this.configService.get<string>("PUBLIC_FE_URL", "http://localhost:3005");

    this.emailClientProxy.emit(EmailType.EMAIL_VERIFICATION, {
      token: tokenEntity,
      user: userEntity,
      baseUrl,
    });
  }

  public getPasswordScore(data: IPasswordScoreDto): IPasswordScoreResult {
    const { score } = zxcvbn(data.password);
    return { score };
  }
}
