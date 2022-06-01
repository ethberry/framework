import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { Erc1155TokenEntity } from "./token.entity";

@Injectable()
export class Erc1155TokenService {
  constructor(
    @InjectRepository(Erc1155TokenEntity)
    private readonly erc1155TokenEntityRepository: Repository<Erc1155TokenEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<Erc1155TokenEntity>,
    options?: FindOneOptions<Erc1155TokenEntity>,
  ): Promise<Erc1155TokenEntity | null> {
    return this.erc1155TokenEntityRepository.findOne({ where, ...options });
  }

  public async update(
    where: FindOptionsWhere<Erc1155TokenEntity>,
    dto: DeepPartial<Erc1155TokenEntity>,
  ): Promise<Erc1155TokenEntity> {
    const { ...rest } = dto;

    const tokenEntity = await this.findOne(where);

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    Object.assign(tokenEntity, rest);

    return tokenEntity.save();
  }

  public getToken(tokenId: string, address: string): Promise<Erc1155TokenEntity | null> {
    const queryBuilder = this.erc1155TokenEntityRepository.createQueryBuilder("token");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("token.erc1155Collection", "collection");

    queryBuilder.andWhere("collection.address = :address", {
      address,
    });
    queryBuilder.andWhere("token.tokenId = :tokenId", {
      tokenId,
    });

    return queryBuilder.getOne();
  }
}
