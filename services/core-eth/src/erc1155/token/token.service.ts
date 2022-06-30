import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { UniTemplateEntity } from "../../blockchain/uni-token/uni-template/uni-template.entity";

@Injectable()
export class Erc1155TokenService {
  constructor(
    @InjectRepository(UniTemplateEntity)
    private readonly erc1155TokenEntityRepository: Repository<UniTemplateEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<UniTemplateEntity>,
    options?: FindOneOptions<UniTemplateEntity>,
  ): Promise<UniTemplateEntity | null> {
    return this.erc1155TokenEntityRepository.findOne({ where, ...options });
  }

  public async update(
    where: FindOptionsWhere<UniTemplateEntity>,
    dto: DeepPartial<UniTemplateEntity>,
  ): Promise<UniTemplateEntity> {
    const { ...rest } = dto;

    const tokenEntity = await this.findOne(where);

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    Object.assign(tokenEntity, rest);

    return tokenEntity.save();
  }

  public getToken(tokenId: string, address: string): Promise<UniTemplateEntity | null> {
    const queryBuilder = this.erc1155TokenEntityRepository.createQueryBuilder("token");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("token.erc1155Collection", "collection");

    queryBuilder.andWhere("contract.address = :address", {
      address,
    });
    queryBuilder.andWhere("token.tokenId = :tokenId", {
      tokenId,
    });

    return queryBuilder.getOne();
  }
}
