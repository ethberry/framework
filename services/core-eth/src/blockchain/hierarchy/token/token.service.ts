import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOneOptions, FindManyOptions, FindOptionsWhere, In, Repository } from "typeorm";

import { TokenEntity } from "./token.entity";
import { testChainId } from "@framework/constants";

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(TokenEntity)
    protected readonly tokenEntityRepository: Repository<TokenEntity>,
    protected readonly configService: ConfigService,
  ) {}

  public findOne(
    where: FindOptionsWhere<TokenEntity>,
    options?: FindOneOptions<TokenEntity>,
  ): Promise<TokenEntity | null> {
    return this.tokenEntityRepository.findOne({ where, ...options });
  }

  public findAll(
    where: FindOptionsWhere<TokenEntity>,
    options?: FindManyOptions<TokenEntity>,
  ): Promise<Array<TokenEntity>> {
    return this.tokenEntityRepository.find({ where, ...options });
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

  public async updateBatchURI(contractId: number, contract: string, baseURI: string): Promise<void> {
    // TODO update array by batch
    const tokenBatch = await this.findAll({ template: { contractId } }, { relations: { template: true } });
    // $url/collection/0xdf2afd789115c4370ec9f78519411ac021da209f/102.jpg
    // imageUrl: `${imgUrl}/${account.toLowerCase()}/${i}.jpg`,

    for (const token of tokenBatch) {
      // TODO case if not jpg?
      const newImageUrl = `${baseURI}/${contract.toLowerCase()}/${token.tokenId}.jpg`;
      Object.assign(token, { imageUrl: newImageUrl });
    }

    await this.createBatch(tokenBatch);
  }

  // public async updateBatch(where: FindOptionsWhere<TokenEntity>, dto: DeepPartial<TokenEntity>): Promise<void> {
  //   const { ...rest } = dto;
  //
  //   const tokenBatch = await this.findAll(where);
  //   // $url/collection/0xdf2afd789115c4370ec9f78519411ac021da209f/102.jpg
  //   for (const token of tokenBatch) {
  //     const tokenUrl = ba;
  //     Object.assign(token, {});
  //   }
  //
  //   Object.assign(tokenEntity, rest);
  //
  //   return tokenEntity.save();
  // }

  public getToken(tokenId: string, address: string, balance = false): Promise<TokenEntity | null> {
    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));

    const queryBuilder = this.tokenEntityRepository.createQueryBuilder("token");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("token.template", "template");
    queryBuilder.leftJoinAndSelect("template.contract", "contract");
    queryBuilder.leftJoinAndSelect("contract.merchant", "merchant");

    if (balance) {
      queryBuilder.leftJoinAndSelect("token.balance", "balance");
    }

    queryBuilder.andWhere("token.tokenId = :tokenId", { tokenId });

    queryBuilder.andWhere("contract.address = :address", {
      address,
    });

    queryBuilder.andWhere("contract.chainId = :chainId", {
      chainId,
    });

    return queryBuilder.getOne();
  }

  public getBatch(
    tokenIds: Array<string>,
    address: string,
    chainId?: number,
    balance = false,
  ): Promise<Array<TokenEntity> | null> {
    const queryBuilder = this.tokenEntityRepository.createQueryBuilder("token");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("token.template", "template");
    if (balance) {
      queryBuilder.leftJoinAndSelect("token.balance", "balance");
    }
    queryBuilder.leftJoinAndSelect("template.contract", "contract");

    queryBuilder.andWhere("token.tokenId = :tokenId", {
      tokenId: In(tokenIds.map(id => id)),
    });

    queryBuilder.andWhere("contract.address = :address", { address });

    if (chainId) {
      queryBuilder.andWhere("contract.chainId = :chainId", {
        chainId,
      });
    }

    return queryBuilder.getMany();
  }
}
