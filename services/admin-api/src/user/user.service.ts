import { createHash } from "crypto";
import { DeleteResult, FindManyOptions, FindOneOptions, FindOptionsWhere, Not, Repository } from "typeorm";
import { ArrayOverlap } from "typeorm/find-options/operator/ArrayOverlap";
import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  LoggerService,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { ClientProxy } from "@nestjs/microservices";

import {
  EmailType,
  IPasswordDto,
  IUserCreateDto,
  IUserSearchDto,
  RmqProviderType,
  OtpType,
  UserRole,
  UserStatus,
} from "@gemunion/framework-types";

import { UserEntity } from "./user.entity";
import { IUserAutocompleteDto, IUserImportDto, IUserUpdateDto } from "./interfaces";
import { OtpService } from "../otp/otp.service";

@Injectable()
export class UserService {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    @InjectRepository(UserEntity)
    private readonly userEntityRepository: Repository<UserEntity>,
    private readonly configService: ConfigService,
    private readonly otpService: OtpService,
    @Inject(RmqProviderType.EML_SERVICE)
    private readonly emailClientProxy: ClientProxy,
  ) {}

  public async search(dto: IUserSearchDto): Promise<[Array<UserEntity>, number]> {
    const { query, userRoles, userStatus } = dto;
    const queryBuilder = this.userEntityRepository.createQueryBuilder("user");

    queryBuilder.select();

    if (userRoles) {
      if (userRoles.length === 1) {
        queryBuilder.andWhere(":userRoles = ANY(user.userRoles)", { userRoles: userRoles[0] });
      } else {
        queryBuilder.andWhere("user.userRoles && :userRoles", { userRoles });
      }
    }

    if (userStatus) {
      if (userStatus.length === 1) {
        queryBuilder.andWhere("user.userStatus = :userStatus", { userStatus: userStatus[0] });
      } else {
        queryBuilder.andWhere("user.userStatus IN(:...userStatus)", { userStatus });
      }
    }

    if (query) {
      queryBuilder.andWhere("user.displayName ILIKE '%' || :displayName || '%'", { displayName: query });
    }

    return queryBuilder.getManyAndCount();
  }

  public async autocomplete(dto: IUserAutocompleteDto): Promise<Array<UserEntity>> {
    const { userRoles = [] } = dto;
    const where = {};

    if (userRoles.length) {
      Object.assign(where, {
        adminRoles: ArrayOverlap(userRoles),
      });
    }

    return this.userEntityRepository.find({
      where,
      select: ["id", "displayName"],
    });
  }

  public findAndCount(
    where: FindOptionsWhere<UserEntity>,
    options?: FindManyOptions<UserEntity>,
  ): Promise<[Array<UserEntity>, number]> {
    return this.userEntityRepository.findAndCount({ where, ...options });
  }

  public findOne(
    where: FindOptionsWhere<UserEntity>,
    options?: FindOneOptions<UserEntity>,
  ): Promise<UserEntity | null> {
    return this.userEntityRepository.findOne({ where, ...options });
  }

  public async update(where: FindOptionsWhere<UserEntity>, dto: IUserUpdateDto): Promise<UserEntity> {
    const { email, ...rest } = dto;

    const userEntity = await this.userEntityRepository.findOne({ where });

    if (!userEntity) {
      throw new NotFoundException("userNotFound");
    }

    if (email && email !== userEntity.email) {
      await this.checkEmail(email, userEntity.id);
      userEntity.userStatus = UserStatus.PENDING;
      const tokenEntity = await this.otpService.getOtp(OtpType.EMAIL, userEntity, { email });
      const baseUrl = this.configService.get<string>("PUBLIC_FE_URL", "http://localhost:3002");
      this.emailClientProxy.emit(EmailType.EMAIL_VERIFICATION, {
        token: tokenEntity,
        user: Object.assign({}, userEntity, { email }),
        baseUrl,
      });
    }

    Object.assign(userEntity, rest);
    return userEntity.save();
  }

  public async create(dto: IUserCreateDto): Promise<UserEntity> {
    let userEntity = await this.findOne({ email: dto.email });

    if (userEntity) {
      throw new ConflictException("duplicateEmail");
    }

    userEntity = await this.userEntityRepository
      .create({
        ...dto,
        password: this.createPasswordHash(dto.password),
        userStatus: UserStatus.PENDING,
        userRoles: [UserRole.CUSTOMER],
      })
      .save();

    return userEntity;
  }

  public async getByCredentials(email: string, password: string): Promise<UserEntity | null> {
    return this.userEntityRepository.findOne({
      where: {
        email,
        password: this.createPasswordHash(password),
      },
    });
  }

  public async updatePassword(userEntity: UserEntity, dto: IPasswordDto): Promise<UserEntity> {
    const passwordHash = this.createPasswordHash(dto.password);
    await this.checkPasswordIsDifferent(userEntity.id, passwordHash);
    userEntity.password = passwordHash;
    return userEntity.save();
  }

  public activate(userEntity: UserEntity): Promise<UserEntity> {
    userEntity.userStatus = UserStatus.ACTIVE;
    return userEntity.save();
  }

  public async import(dto: IUserImportDto): Promise<UserEntity> {
    return this.userEntityRepository
      .create({
        ...dto,
        password: "",
        userRoles: [UserRole.CUSTOMER],
      })
      .save();
  }

  public delete(where: FindOptionsWhere<UserEntity>): Promise<DeleteResult> {
    return this.userEntityRepository.delete(where);
  }

  public createPasswordHash(password: string): string {
    const passwordSecret = this.configService.get<string>("PASSWORD_SECRET", "keyboard_cat");
    return createHash("sha256").update(passwordSecret).update(password).digest("hex");
  }

  public async checkEmail(email: string, id: number): Promise<void> {
    const userEntity = await this.findOne({
      email,
      id: Not(id),
    });

    if (userEntity) {
      throw new ConflictException("duplicateEmail");
    }
  }

  public async checkPasswordIsDifferent(id: number, password: string): Promise<void> {
    const userEntity = await this.userEntityRepository.findOne({ where: { id, password } });
    if (userEntity) {
      throw new BadRequestException("passwordsAreIdentical");
    }
  }
}
