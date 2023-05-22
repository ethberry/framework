import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";

import { ITokenSearchDto, ModuleType, TokenType } from "@framework/types";

import { UserEntity } from "../../../../infrastructure/user/user.entity";
import { TokenEntity } from "../../../hierarchy/token/token.entity";
import { TokenService } from "../../../hierarchy/token/token.service";
import { BalanceEntity } from "../../../hierarchy/balance/balance.entity";

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
    // return this.findOne(where, {
    //   join: {
    //     alias: "token",
    //     leftJoinAndSelect: {
    //       // token_parent: "token.parent",
    //       token_children: "token.children",
    //       token_children_child: "token_children.child",
    //       token_children_template: "token_children_child.template",
    //       token_children_contract: "token_children_template.contract",
    //       contract_children: "contract.children",
    //       composition_child: "contract_children.child",
    //       // breeds: "token.breeds",
    //       // breed_children: "breeds.children",
    //       // breed_history: "breed_children.history",
    //     },
    //   },
    // });

    const queryBuilder = this.tokenEntityRepository.createQueryBuilder("token");

    queryBuilder.leftJoinAndSelect("token.history", "history");
    queryBuilder.leftJoinAndSelect("token.exchange", "exchange");
    queryBuilder.leftJoinAndSelect("exchange.history", "asset_component_history");
    queryBuilder.leftJoinAndSelect("asset_component_history.assets", "asset_component_history_assets");
    queryBuilder.leftJoinAndSelect("asset_component_history_assets.token", "assets_token");
    queryBuilder.leftJoinAndSelect("asset_component_history_assets.contract", "assets_contract");

    queryBuilder.leftJoinAndSelect("token.template", "template");
    queryBuilder.leftJoinAndSelect("template.price", "price");
    queryBuilder.leftJoinAndSelect("price.components", "price_components");
    queryBuilder.leftJoinAndSelect("price_components.contract", "price_contract");
    queryBuilder.leftJoinAndSelect("price_components.template", "price_template");

    queryBuilder.leftJoinAndSelect("template.contract", "contract");
    queryBuilder.leftJoinAndSelect("contract.children", "contract_children");
    queryBuilder.leftJoinAndSelect("contract_children.child", "composition_child");

    queryBuilder.leftJoinAndMapMany(
      "token.balance",
      BalanceEntity,
      "balance",
      "balance.account = contract.address AND balance.targetId = token.id",
    );
    queryBuilder.leftJoinAndSelect("balance.token", "balance_token");
    queryBuilder.leftJoinAndSelect("balance_token.template", "balance_token_template");
    queryBuilder.leftJoinAndSelect("balance_token_template.contract", "balance_token_template_contract");

    queryBuilder.andWhere("token.id = :id", {
      id: where.id,
    });

    return queryBuilder.getOne();
  }
}
