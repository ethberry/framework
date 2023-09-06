import { Injectable } from "@nestjs/common";
import { FindManyOptions, FindOneOptions, FindOptionsWhere, Repository, UpdateResult } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { UserRole } from "@framework/types";

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

  public findAll(
    where: FindOptionsWhere<UserEntity>,
    options?: FindManyOptions<UserEntity>,
  ): Promise<Array<UserEntity>> {
    return this.userEntityRepository.find({ where, ...options });
  }

  public findAndCount(
    where: FindOptionsWhere<UserEntity>,
    options?: FindManyOptions<UserEntity>,
  ): Promise<[Array<UserEntity>, number]> {
    return this.userEntityRepository.findAndCount({ where, ...options });
  }

  public async import(dto: IUserImportDto): Promise<UserEntity> {
    return this.userEntityRepository.create(dto).save();
  }

  public async removeRole(where: FindOptionsWhere<UserEntity>, role: UserRole): Promise<UpdateResult> {
    const queryBuilder = this.userEntityRepository.createQueryBuilder("contract").update();
    queryBuilder.set({
      userRoles: () => `array_remove("user_roles", '${role}')`,
    });
    queryBuilder.where(where);

    return queryBuilder.execute();
  }
}
