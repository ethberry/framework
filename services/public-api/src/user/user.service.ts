import { ConflictException, Inject, Injectable, Logger, LoggerService, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { FindOptionsWhere, FindManyOptions, FindOneOptions, Not, Repository } from "typeorm";
import { createHash } from "crypto";

import { IPasswordDto, IUserCreateDto, UserRole, UserStatus } from "@gemunion/framework-types";

import { UserEntity } from "./user.entity";
import { IUserImportDto } from "./interfaces";

@Injectable()
export class UserService {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    @InjectRepository(UserEntity)
    private readonly userEntityRepository: Repository<UserEntity>,
    private readonly configService: ConfigService,
  ) {}

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
