import { DeleteResult, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { UserEntity } from "./user.entity";
import { IUserImportDto } from "./interfaces";

@Injectable()
export class UserService {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
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

  public delete(where: FindOptionsWhere<UserEntity>): Promise<DeleteResult> {
    return this.userEntityRepository.delete(where);
  }

  public profile(where: FindOptionsWhere<UserEntity>): Promise<UserEntity | null> {
    const queryBuilder = this.userEntityRepository.createQueryBuilder("user");

    queryBuilder.select();
    queryBuilder.where(where);

    queryBuilder.leftJoin("user.balance", "balance");
    queryBuilder.addSelect(["balance.coin", "balance.loci"]);

    return queryBuilder.getOne();
  }
}
