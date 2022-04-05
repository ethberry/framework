import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, FindOptionsWhere, Repository } from "typeorm";
import { v4 } from "uuid";
import zxcvbn from "zxcvbn";

import { IJwt } from "@gemunion/types-jwt";
import { ILoginDto, IUserCreateDto, TokenType, UserRole, UserStatus } from "@gemunion/framework-types";

import { UserService } from "../user/user.service";
import { UserEntity } from "../user/user.entity";
import {
  IEmailVerificationDto,
  IForgotPasswordDto,
  IPasswordScoreDto,
  IPasswordScoreResult,
  IResendEmailVerificationDto,
  IRestorePasswordDto,
} from "./interfaces";
import { AuthEntity } from "./auth.entity";
import { IUserImportDto } from "../user/interfaces";
import { TokenService } from "../token/token.service";
import { EmailService } from "../email/email.service";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthEntity)
    private readonly authEntityRepository: Repository<AuthEntity>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  public async login(dto: ILoginDto, ip: string): Promise<IJwt> {
    const userEntity = await this.userService.getByCredentials(dto.email, dto.password);

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

  public async logout(where: FindOptionsWhere<AuthEntity>): Promise<DeleteResult> {
    return this.authEntityRepository.delete(where);
  }

  public async refresh(where: FindOptionsWhere<AuthEntity>, ip: string): Promise<IJwt> {
    const authEntity = await this.authEntityRepository.findOne({ where, relations: { user: true } });

    if (!authEntity || authEntity.refreshTokenExpiresAt < new Date().getTime()) {
      throw new UnauthorizedException("refreshTokenHasExpired");
    }

    if (authEntity.user.userStatus !== UserStatus.ACTIVE) {
      throw new UnauthorizedException("userIsNotActive");
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

    // await this.emailService.welcome(userEntity);

    await this.emailService.emailVerification(userEntity);

    return userEntity;
  }

  public async import(dto: IUserImportDto): Promise<UserEntity> {
    const userEntity = await this.userService.import(dto);

    // await this.emailService.welcome(userEntity);

    if (dto.userStatus === UserStatus.PENDING) {
      await this.emailService.emailVerification(userEntity);
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

    await this.emailService.forgotPassword(userEntity);
  }

  public async restorePassword(dto: IRestorePasswordDto): Promise<void> {
    const tokenEntity = await this.tokenService.findOne({ uuid: dto.token, tokenType: TokenType.PASSWORD });

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    await this.userService.updatePassword(tokenEntity.user, dto);

    await this.emailService.restorePassword(tokenEntity.user);

    // delete token from db
    await tokenEntity.remove();
  }

  public async emailVerification(dto: IEmailVerificationDto): Promise<void> {
    const tokenEntity = await this.tokenService.findOne(
      { uuid: dto.token, tokenType: TokenType.EMAIL },
      { relations: { user: true } },
    );

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    if (tokenEntity.data.email) {
      tokenEntity.user.email = tokenEntity.data.email;
      void tokenEntity.user.save();
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

    await this.emailService.emailVerification(userEntity);
  }

  public getPasswordScore(dto: IPasswordScoreDto): IPasswordScoreResult {
    const { score } = zxcvbn(dto.password);
    return { score };
  }
}
