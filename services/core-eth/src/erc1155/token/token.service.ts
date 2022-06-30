import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { TemplateEntity } from "../../blockchain/hierarchy/template/template.entity";

@Injectable()
export class Erc1155TokenService {
  constructor(
    @InjectRepository(TemplateEntity)
    private readonly erc1155TokenEntityRepository: Repository<TemplateEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<TemplateEntity>,
    options?: FindOneOptions<TemplateEntity>,
  ): Promise<TemplateEntity | null> {
    return this.erc1155TokenEntityRepository.findOne({ where, ...options });
  }

  public async update(
    where: FindOptionsWhere<TemplateEntity>,
    dto: DeepPartial<TemplateEntity>,
  ): Promise<TemplateEntity> {
    const { ...rest } = dto;

    const tokenEntity = await this.findOne(where);

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    Object.assign(tokenEntity, rest);

    return tokenEntity.save();
  }

  public getToken(tokenId: string, address: string): Promise<TemplateEntity | null> {
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
