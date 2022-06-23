import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { ns } from "@framework/constants";
import { IStakingRuleItem, TokenType } from "@framework/types";
import { IdBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";
import { StakingRuleEntity } from "./staking.entity";
import { Erc20TokenEntity } from "../../erc20/token/token.entity";
import { Erc721CollectionEntity } from "../../erc721/collection/collection.entity";
import { Erc1155CollectionEntity } from "../../erc1155/collection/collection.entity";
import { Erc998CollectionEntity } from "../../erc998/collection/collection.entity";

@Entity({ schema: ns, name: "staking_rule_deposit" })
export class StakingDepositEntity extends IdBaseEntity implements IStakingRuleItem {
  @Column({
    type: "enum",
    enum: TokenType,
  })
  public tokenType: TokenType;

  @Column({ type: "numeric" })
  public collection: number;

  @Column({ type: "numeric" })
  public tokenId: number;

  @Column({ type: "numeric" })
  public amount: string;

  @Column({ type: "int" })
  public stakingRuleId: number;

  @JoinColumn()
  @OneToOne(_type => StakingRuleEntity)
  public stakingRule: StakingRuleEntity;

  public erc20: Erc20TokenEntity;
  public erc721: Erc721CollectionEntity;
  public erc998: Erc998CollectionEntity;
  public erc1155: Erc1155CollectionEntity;
}
