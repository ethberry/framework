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

  public async createBatch(dto: Array<DeepPartial<TokenEntity>>): Promise<Array<TokenEntity>> {
    return this.tokenEntityRepository.save(dto, { chunk: 1000 });
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

  public getToken(tokenId: string, address: string, chainId?: number, balance = false): Promise<TokenEntity | null> {
    const queryBuilder = this.tokenEntityRepository.createQueryBuilder("token");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("token.template", "template");
    if (balance) {
      queryBuilder.leftJoinAndSelect("token.balance", "balance");
    }
    queryBuilder.leftJoinAndSelect("template.contract", "contract");

    queryBuilder.andWhere("token.tokenId = :tokenId", {
      tokenId: Number(tokenId).toString(),
    });

    queryBuilder.andWhere("contract.address = :address", {
      address,
    });

    if (chainId) {
      queryBuilder.andWhere("contract.chainId = :chainId", {
        chainId,
      });
    }

    return queryBuilder.getOne();
  }
}
