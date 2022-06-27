import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { UniTokenStatus } from "@framework/types";

import { UniTokenEntity } from "./token.entity";

@Injectable()
export class Erc721TokenService {
  constructor(
    @InjectRepository(UniTokenEntity)
    private readonly erc721TokenEntityRepository: Repository<UniTokenEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<UniTokenEntity>,
    options?: FindOneOptions<UniTokenEntity>,
  ): Promise<UniTokenEntity | null> {
    return this.erc721TokenEntityRepository.findOne({ where, ...options });
  }

  public async create(dto: DeepPartial<UniTokenEntity>): Promise<UniTokenEntity> {
    return this.erc721TokenEntityRepository.create(dto).save();
  }

  public async update(
    where: FindOptionsWhere<UniTokenEntity>,
    dto: DeepPartial<UniTokenEntity>,
  ): Promise<UniTokenEntity> {
    const { ...rest } = dto;

    const tokenEntity = await this.findOne(where);

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    Object.assign(tokenEntity, rest);

    return tokenEntity.save();
  }

  public getToken(
    tokenId: string,
    address: string,
    tokenStatus?: UniTokenStatus,
  ): Promise<UniTokenEntity | null> {
    const queryBuilder = this.erc721TokenEntityRepository.createQueryBuilder("token");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("token.erc721Template", "template");
    queryBuilder.leftJoinAndSelect("template.erc721Collection", "collectionToken");
    queryBuilder.leftJoinAndSelect("token.erc721Dropbox", "dropbox");
    queryBuilder.leftJoinAndSelect("dropbox.erc721Collection", "collectionDropbox");
    queryBuilder.leftJoinAndSelect("dropbox.erc721Template", "templateDropbox");

    queryBuilder.andWhere("token.tokenId = :tokenId", {
      tokenId,
    });

    queryBuilder.andWhere(
      new Brackets(qb => {
        qb.where("collectionToken.address = :address", { address });
        qb.orWhere("collectionDropbox.address = :address", { address });
      }),
    );

    if (tokenStatus) {
      queryBuilder.andWhere("token.tokenStatus = :tokenStatus", {
        tokenStatus,
      });
    }

    return queryBuilder.getOne();
  }
}
