import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { UniTokenStatus } from "@framework/types";

import { Erc998TokenEntity } from "./token.entity";

@Injectable()
export class Erc998TokenService {
  constructor(
    @InjectRepository(Erc998TokenEntity)
    private readonly erc998TokenEntityRepository: Repository<Erc998TokenEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<Erc998TokenEntity>,
    options?: FindOneOptions<Erc998TokenEntity>,
  ): Promise<Erc998TokenEntity | null> {
    return this.erc998TokenEntityRepository.findOne({ where, ...options });
  }

  public async create(dto: DeepPartial<Erc998TokenEntity>): Promise<Erc998TokenEntity> {
    return this.erc998TokenEntityRepository.create(dto).save();
  }

  public async update(
    where: FindOptionsWhere<Erc998TokenEntity>,
    dto: DeepPartial<Erc998TokenEntity>,
  ): Promise<Erc998TokenEntity> {
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
  ): Promise<Erc998TokenEntity | null> {
    const queryBuilder = this.erc998TokenEntityRepository.createQueryBuilder("token");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("token.erc998Template", "template");
    queryBuilder.leftJoinAndSelect("template.erc998Collection", "collectionToken");
    queryBuilder.leftJoinAndSelect("token.erc998Dropbox", "dropbox");
    queryBuilder.leftJoinAndSelect("dropbox.erc998Collection", "collectionDropbox");
    queryBuilder.leftJoinAndSelect("dropbox.erc998Template", "templateDropbox");

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
