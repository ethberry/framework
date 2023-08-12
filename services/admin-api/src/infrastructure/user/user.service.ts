import { Injectable } from "@nestjs/common";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { UserEntity } from "./user.entity";
import type { IUserImportDto } from "./interfaces";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userEntityRepository: Repository<UserEntity>,
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
}
