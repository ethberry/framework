import { Injectable, NotFoundException } from "@nestjs/common";
import { FindOneOptions, FindOptionsWhere, Repository, UpdateResult } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { UserEntity } from "./user.entity";
import type { IUserImportDto } from "./interfaces";
import { UserRole } from "@framework/types";

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

  public count(where: FindOptionsWhere<UserEntity>): Promise<number> {
    return this.userEntityRepository.count({ where });
  }

  public async update(where: FindOptionsWhere<UserEntity>, dto: any): Promise<UserEntity> {
    const userEntity = await this.findOne(where);

    if (!userEntity) {
      throw new NotFoundException("userNotFound");
    }

    Object.assign(userEntity, dto);

    return userEntity.save();
  }

  public async addRole(where: FindOptionsWhere<UserEntity>, role: UserRole): Promise<UpdateResult> {
    const queryBuilder = this.userEntityRepository.createQueryBuilder("contract").update();
    queryBuilder.set({
      userRoles: () => `array_append("userRoles", '${role}')`,
    });
    queryBuilder.where(where);

    return queryBuilder.execute();
  }
}
