import { Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, FindConditions, Repository } from "typeorm";
import { v4 } from "uuid";
import zxcvbn from "zxcvbn";

import { EmailType, IUserCreateDto, ProviderType, TokenType, UserRole, UserStatus } from "@gemunion/framework-types";
import { IJwt } from "@gemunion/types-jwt";

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
import { IUserImportDto } from "../user/interfaces";
import { TokenService } from "../token/token.service";

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

  public async login(dto: ILoginDto, ip: string): Promise<IJwt> {
    const userEntity = await this.userService.getByCredentials(dto.email, dto.password);

    if (!userEntity) {
      throw new UnauthorizedException("userNotFound");
    }

    if (userEntity.userStatus !== UserStatus.ACTIVE) {
      throw new UnauthorizedException("userIsNotActive");
    }

    const roles = [UserRole.ADMIN, UserRole.MERCHANT, UserRole.CUSTOMER];
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

  public async signup(dto: IUserCreateDto): Promise<UserEntity> {
    const userEntity = await this.userService.create(dto);

    const baseUrl = this.configService.get<string>("PUBLIC_FE_URL", "http://localhost:3005");

    this.emailClientProxy.emit(EmailType.WELCOME, {
      user: userEntity,
      baseUrl,
    });

    const tokenEntity = await this.tokenService.getToken(TokenType.EMAIL, userEntity);

    this.emailClientProxy.emit(EmailType.EMAIL_VERIFICATION, {
      token: tokenEntity,
      user: userEntity,
      baseUrl,
    });

    return userEntity;
  }

  public async import(dto: IUserImportDto): Promise<UserEntity> {
    const userEntity = await this.userService.import(dto);

    const baseUrl = this.configService.get<string>("PUBLIC_FE_URL", "http://localhost:3005");

    this.emailClientProxy.emit(EmailType.WELCOME, {
      user: userEntity,
      baseUrl,
    });

    if (dto.userStatus === UserStatus.PENDING) {
      const tokenEntity = await this.tokenService.getToken(TokenType.EMAIL, userEntity);

      this.emailClientProxy.emit(EmailType.EMAIL_VERIFICATION, {
        token: tokenEntity,
        user: userEntity,
        baseUrl,
      });
    }

    return userEntity;
  }

  public async forgotPassword(dto: IForgotPasswordDto): Promise<void> {
    const userEntity = await this.userService.findOne({ email: dto.email });

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

  public async restorePassword(dto: IRestorePasswordDto): Promise<void> {
    const tokenEntity = await this.tokenService.findOne({ uuid: dto.token, tokenType: TokenType.PASSWORD });

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    await this.userService.updatePassword(tokenEntity.user, dto);

    const baseUrl = this.configService.get<string>("PUBLIC_FE_URL", "http://localhost:3005");

    this.emailClientProxy.emit(EmailType.RESTORE_PASSWORD, {
      user: tokenEntity.user,
      baseUrl,
    });

    // delete token from db
    await tokenEntity.remove();
  }

  public async emailVerification(dto: IEmailVerificationDto): Promise<void> {
    const tokenEntity = await this.tokenService.findOne({ uuid: dto.token, tokenType: TokenType.EMAIL });

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    await this.userService.activate(tokenEntity.user);
    // delete token from db
    await tokenEntity.remove();
  }

  public async resendEmailVerification(dto: IResendEmailVerificationDto): Promise<void> {
    const userEntity = await this.userService.findOne({ email: dto.email });

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

  public getPasswordScore(dto: IPasswordScoreDto): IPasswordScoreResult {
    const { score } = zxcvbn(dto.password);
    return { score };
  }
}
