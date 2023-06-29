import { forwardRef, Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { UserEntity } from "./user.entity";
import { AuthService } from "../auth/auth.service";
import { IUserImportDto } from "./interfaces";

@Injectable()
export class UserService {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    @InjectRepository(UserEntity)
    private readonly userEntityRepository: Repository<UserEntity>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  public findOne(
    where: FindOptionsWhere<UserEntity>,
    options?: FindOneOptions<UserEntity>,
  ): Promise<UserEntity | null> {
    return this.userEntityRepository.findOne({ where, ...options });
  }

  public async import(dto: IUserImportDto): Promise<UserEntity> {
    return this.userEntityRepository.create(dto).save();
  }

  public count(where: FindOptionsWhere<UserEntity>): Promise<number> {
    return this.userEntityRepository.count({ where });
  }
}
