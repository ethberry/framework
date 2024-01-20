import {
  forwardRef,
  Inject,
  Injectable,
  Logger,
  LoggerService,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { ArrayOverlap, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository, UpdateResult } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import type { IUserSearchDto } from "@framework/types";
import { UserRole } from "@framework/types";

import { AuthService } from "../auth/auth.service";
import { UserEntity } from "./user.entity";
import type { IUserAutocompleteDto, IUserImportDto, IUserUpdateDto } from "./interfaces";

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

  public async search(dto: Partial<IUserSearchDto>): Promise<[Array<UserEntity>, number]> {
    const { query, userRoles, userStatus, skip, take } = dto;
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

    queryBuilder.skip(skip);
    queryBuilder.take(take);

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
      select: {
        id: true,
        displayName: true,
      },
    });
  }

  public findOne(
    where: FindOptionsWhere<UserEntity>,
    options?: FindOneOptions<UserEntity>,
  ): Promise<UserEntity | null> {
    return this.userEntityRepository.findOne({ where, ...options });
  }

  public async update(
    where: FindOptionsWhere<UserEntity>,
    dto: Partial<IUserUpdateDto>,
    user: UserEntity,
  ): Promise<UserEntity> {
    const { userRoles, ...rest } = dto;

    const userEntity = await this.userEntityRepository.findOne({ where });

    if (!userEntity) {
      throw new NotFoundException("userNotFound");
    }

    // UPDATING CERTAIN USER-ROLES for SUPER ADMIN ONLY !!!
    if (userRoles) {
      if (userRoles.includes(UserRole.SUPER) || userRoles.includes(UserRole.ADMIN)) {
        if (user.userRoles.includes(UserRole.SUPER)) {
          Object.assign(userEntity, userRoles);
        } else {
          throw new ForbiddenException("insufficientPermissions");
        }
      } else {
        Object.assign(userEntity, userRoles);
      }
    }

    Object.assign(userEntity, rest);
    return userEntity.save();
  }

  public async addRole(where: FindOptionsWhere<UserEntity>, role: UserRole): Promise<UpdateResult> {
    const queryBuilder = this.userEntityRepository.createQueryBuilder("contract").update();
    queryBuilder.set({
      userRoles: () => `array_append("user_roles", '${role}')`,
    });
    queryBuilder.where(where);

    return queryBuilder.execute();
  }

  public findAll(
    where: FindOptionsWhere<UserEntity>,
    options?: FindManyOptions<UserEntity>,
  ): Promise<Array<UserEntity>> {
    return this.userEntityRepository.find({ where, ...options });
  }

  public async import(dto: IUserImportDto): Promise<UserEntity> {
    return this.userEntityRepository.create(dto).save();
  }

  public count(where: FindOptionsWhere<UserEntity>): Promise<number> {
    return this.userEntityRepository.count({ where });
  }

  public async removeRole(where: FindOptionsWhere<UserEntity>, role: UserRole): Promise<UpdateResult> {
    const queryBuilder = this.userEntityRepository.createQueryBuilder("contract").update();
    queryBuilder.set({
      userRoles: () => `array_remove("user_roles", '${role}')`,
    });
    queryBuilder.where(where);

    return queryBuilder.execute();
  }

  public async delete(where: FindOptionsWhere<UserEntity>): Promise<UserEntity> {
    const userEntity = await this.findOne(where);

    if (!userEntity) {
      throw new NotFoundException("userNotFound");
    }

    await this.authService.delete(userEntity).catch(e => {
      this.loggerService.error(e, UserService.name);
    });

    return userEntity.remove();
  }
}
