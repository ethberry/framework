import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";

import { ModuleType, TokenType } from "@framework/types";
import type { ITokenSearchDto } from "@framework/types";

import { UserEntity } from "../../../../../infrastructure/user/user.entity";
import { TokenEntity } from "../../../../hierarchy/token/token.entity";
import { TokenService } from "../../../../hierarchy/token/token.service";
import { LootBoxEntity } from "../box/box.entity";

@Injectable()
export class LootTokenService extends TokenService {
  constructor(
    @InjectRepository(TokenEntity)
    protected readonly tokenEntityRepository: Repository<TokenEntity>,
  ) {
    super(tokenEntityRepository);
  }

  public async search(dto: Partial<ITokenSearchDto>, userEntity: UserEntity): Promise<[Array<TokenEntity>, number]> {
    return super.search(dto, userEntity, [ModuleType.LOOT], [TokenType.ERC721]);
  }

  public findOneWithRelations(where: FindOptionsWhere<TokenEntity>): Promise<TokenEntity | null> {
    const queryBuilder = this.tokenEntityRepository.createQueryBuilder("token");

    queryBuilder.leftJoinAndSelect("token.template", "template");
    queryBuilder.leftJoinAndSelect("template.price", "price");
    queryBuilder.leftJoinAndSelect("price.components", "price_components");
    queryBuilder.leftJoinAndSelect("price_components.contract", "price_contract");
    queryBuilder.leftJoinAndSelect("price_components.template", "price_template");

    queryBuilder.leftJoinAndMapOne("template.box", LootBoxEntity, "box", "box.templateId = template.id");
    queryBuilder.leftJoinAndSelect("box.content", "content");
    queryBuilder.leftJoinAndSelect("content.components", "content_components");
    queryBuilder.leftJoinAndSelect("content_components.template", "content_template");
    queryBuilder.leftJoinAndSelect("content_components.contract", "content_contract");

    queryBuilder.leftJoinAndSelect("template.contract", "contract");

    queryBuilder.andWhere("token.id = :id", {
      id: where.id,
    });

    return queryBuilder.getOne();
  }
}
