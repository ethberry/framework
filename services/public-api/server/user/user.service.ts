import {createHash, randomBytes} from "crypto";
import {FindConditions, FindManyOptions, FindOneOptions, Repository} from "typeorm";
import {ConflictException, Inject, Injectable, Logger, LoggerService} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {ConfigService} from "@nestjs/config";

import {UserRole, UserStatus} from "@trejgun/solo-types";

import {UserEntity} from "./user.entity";
import {IUserCreateDto, IUserImportDto} from "./interfaces";
import {IPasswordDto} from "../auth/interfaces";

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
    where: FindConditions<UserEntity>,
    options?: FindManyOptions<UserEntity>,
  ): Promise<[Array<UserEntity>, number]> {
    return this.userEntityRepository.findAndCount({where, ...options});
  }

  public findOne(
    where: FindConditions<UserEntity>,
    options?: FindOneOptions<UserEntity>,
  ): Promise<UserEntity | undefined> {
    return this.userEntityRepository.findOne({where, ...options});
  }

  public async create(data: IUserCreateDto): Promise<UserEntity> {
    let userEntity = await this.findOne({email: data.email});

    if (userEntity) {
      throw new ConflictException("duplicateEmail");
    }

    userEntity = await this.userEntityRepository
      .create({
        ...data,
        password: this.createPasswordHash(data.password),
        userStatus: UserStatus.PENDING,
        userRoles: [UserRole.CUSTOMER],
      })
      .save();

    return userEntity;
  }

  public async getByCredentials(email: string, password: string): Promise<UserEntity | undefined> {
    return this.userEntityRepository.findOne({
      where: {
        email,
        password: this.createPasswordHash(password),
      },
    });
  }

  public updatePassword(userEntity: UserEntity, data: IPasswordDto): Promise<UserEntity> {
    userEntity.password = this.createPasswordHash(data.password);
    return userEntity.save();
  }

  public activate(userEntity: UserEntity): Promise<UserEntity> {
    userEntity.userStatus = UserStatus.ACTIVE;
    return userEntity.save();
  }

  public async import(data: IUserImportDto): Promise<UserEntity> {
    return this.userEntityRepository
      .create({
        ...data,
        password: this.createPasswordHash(randomBytes(8).toString("hex")),
        userRoles: [UserRole.CUSTOMER],
      })
      .save();
  }

  public createPasswordHash(password: string): string {
    const passwordSecret = this.configService.get<string>("PASSWORD_SECRET", "keyboard_cat");
    return createHash("sha256").update(password).update(passwordSecret).digest("hex");
  }
}
