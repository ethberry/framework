import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { UniTokenStatus } from "@framework/types";

import { UniTokenEntity } from "../../blockchain/uni-token/uni-token.entity";

@Injectable()
export class Erc998TokenService {
  constructor(
    @InjectRepository(UniTokenEntity)
    private readonly uniTokenEntityRepository: Repository<UniTokenEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<UniTokenEntity>,
    options?: FindOneOptions<UniTokenEntity>,
  ): Promise<UniTokenEntity | null> {
    return this.uniTokenEntityRepository.findOne({ where, ...options });
  }

  public async create(dto: DeepPartial<UniTokenEntity>): Promise<UniTokenEntity> {
    return this.uniTokenEntityRepository.create(dto).save();
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

  public getToken(tokenId: string, address: string, tokenStatus?: UniTokenStatus): Promise<UniTokenEntity | null> {
    const queryBuilder = this.uniTokenEntityRepository.createQueryBuilder("token");

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
