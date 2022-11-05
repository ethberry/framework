import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";

import { ITokenSearchDto, ModuleType, TokenType } from "@framework/types";

import { UserEntity } from "../../../../user/user.entity";
import { TokenEntity } from "../../../hierarchy/token/token.entity";
import { TokenService } from "../../../hierarchy/token/token.service";

@Injectable()
export class Erc998TokenService extends TokenService {
  constructor(
    @InjectRepository(TokenEntity)
    protected readonly tokenEntityRepository: Repository<TokenEntity>,
  ) {
    super(tokenEntityRepository);
  }

  public async search(dto: ITokenSearchDto, userEntity: UserEntity): Promise<[Array<TokenEntity>, number]> {
    return super.search(dto, userEntity, TokenType.ERC998, ModuleType.HIERARCHY);
  }

  public findOneWithRelations(where: FindOptionsWhere<TokenEntity>): Promise<TokenEntity | null> {
    return this.findOne(where, {
      join: {
        alias: "token",
        leftJoinAndSelect: {
          exchange_history: "token.exchangeHistory",
          asset_component_history: "exchange_history.history",
          asset_component_history_assets: "asset_component_history.assets",
          assets_token: "asset_component_history_assets.token",
          assets_contract: "asset_component_history_assets.contract",
          template: "token.template",
          contract: "template.contract",
          // token_parent: "token.parent",
          token_children: "token.children",
          token_children_child: "token_children.child",
          token_children_template: "token_children_child.template",
          token_children_contract: "token_children_template.contract",
          contract_children: "contract.children",
          composition_child: "contract_children.child",
          price: "template.price",
          price_components: "price.components",
          price_contract: "price_components.contract",
          price_template: "price_components.template",
          contract_history: "token.contractHistory",
          breeds: "token.breeds",
          breed_children: "breeds.children",
          breed_history: "breed_children.history",
        },
      },
    });
  }
}
