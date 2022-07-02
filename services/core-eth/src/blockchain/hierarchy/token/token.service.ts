import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { TokenEntity } from "./token.entity";

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(TokenEntity)
    private readonly tokenEntityRepository: Repository<TokenEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<TokenEntity>,
    options?: FindOneOptions<TokenEntity>,
  ): Promise<TokenEntity | null> {
    return this.tokenEntityRepository.findOne({ where, ...options });
  }

  public async create(dto: DeepPartial<TokenEntity>): Promise<TokenEntity> {
    return this.tokenEntityRepository.create(dto).save();
  }

  public async update(where: FindOptionsWhere<TokenEntity>, dto: DeepPartial<TokenEntity>): Promise<TokenEntity> {
    const { ...rest } = dto;

    const tokenEntity = await this.findOne(where);

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    Object.assign(tokenEntity, rest);

    return tokenEntity.save();
  }

  public getToken(tokenId: string, address: string): Promise<TokenEntity | null> {
    const queryBuilder = this.tokenEntityRepository.createQueryBuilder("token");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("token.template", "template");
    queryBuilder.leftJoinAndSelect("template.contract", "contract");
    // queryBuilder.leftJoinAndSelect("token.erc998Dropbox", "dropbox");
    // queryBuilder.leftJoinAndSelect("dropbox.erc998Collection", "collectionDropbox");
    // queryBuilder.leftJoinAndSelect("dropbox.erc998Template", "templateDropbox");

    queryBuilder.andWhere("token.tokenId = :tokenId", {
      tokenId,
    });

    queryBuilder.andWhere("contract.address = :address", {
      address,
    });

    return queryBuilder.getOne();
  }
}
