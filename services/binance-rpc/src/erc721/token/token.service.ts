import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { Erc721TokenStatus } from "@framework/types";

import { Erc721TokenEntity } from "./token.entity";

@Injectable()
export class Erc721TokenService {
  constructor(
    @InjectRepository(Erc721TokenEntity)
    private readonly erc721TokenEntityRepository: Repository<Erc721TokenEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<Erc721TokenEntity>,
    options?: FindOneOptions<Erc721TokenEntity>,
  ): Promise<Erc721TokenEntity | null> {
    return this.erc721TokenEntityRepository.findOne({ where, ...options });
  }

  public async create(dto: DeepPartial<Erc721TokenEntity>): Promise<Erc721TokenEntity> {
    return this.erc721TokenEntityRepository.create(dto).save();
  }

  public async update(
    where: FindOptionsWhere<Erc721TokenEntity>,
    dto: DeepPartial<Erc721TokenEntity>,
  ): Promise<Erc721TokenEntity> {
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
    tokenStatus?: Erc721TokenStatus,
  ): Promise<Erc721TokenEntity | null> {
    const queryBuilder = this.erc721TokenEntityRepository.createQueryBuilder("token");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("token.erc721Template", "template");
    queryBuilder.leftJoinAndSelect("template.erc721Collection", "collectionToken");
    queryBuilder.leftJoinAndSelect("token.erc721Dropbox", "dropbox");
    queryBuilder.leftJoinAndSelect("dropbox.erc721Collection", "collectionDropbox");

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
