import { ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { IWhitelistSearchDto } from "@framework/types";

import { IWhitelistItemCreateDto } from "./interfaces";
import { WhitelistEntity } from "./whitelist.entity";

@Injectable()
export class WhitelistService {
  constructor(
    @InjectRepository(WhitelistEntity)
    private readonly whitelistEntityRepository: Repository<WhitelistEntity>,
  ) {}

  public async search(dto: Partial<IWhitelistSearchDto>): Promise<[Array<WhitelistEntity>, number]> {
    const { skip, take, account } = dto;

    const queryBuilder = this.whitelistEntityRepository.createQueryBuilder("whitelist");

    queryBuilder.select();

    if (account) {
      queryBuilder.andWhere("whitelist.account ILIKE '%' || :account || '%'", { account });
    }

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "whitelist.createdAt": "ASC",
    });

    return queryBuilder.getManyAndCount();
  }

  public findOne(
    where: FindOptionsWhere<WhitelistEntity>,
    options?: FindOneOptions<WhitelistEntity>,
  ): Promise<WhitelistEntity | null> {
    return this.whitelistEntityRepository.findOne({ where, ...options });
  }

  public async create(dto: IWhitelistItemCreateDto): Promise<WhitelistEntity> {
    const whitelistEntity = await this.findOne(dto);

    if (whitelistEntity) {
      throw new ConflictException("duplicateAccount");
    }

    return this.whitelistEntityRepository.create(dto).save();
  }

  public async delete(where: FindOptionsWhere<WhitelistEntity>): Promise<DeleteResult> {
    return this.whitelistEntityRepository.delete(where);
  }

  public async generate(): Promise<{ proof: string }> {
    return Promise.resolve({ proof: "abcde" });
  }
}
