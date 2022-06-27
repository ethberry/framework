import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { ns } from "@framework/constants";
import { IStakingItem, TokenType } from "@framework/types";
import { IdBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";
import { StakingEntity } from "./staking.entity";
import { UniTemplateEntity } from "../../erc20/token/token.entity";
import { UniContractEntity } from "../../erc721/collection/collection.entity";
import { UniContractEntity } from "../../erc1155/collection/collection.entity";
import { UniContractEntity } from "../../erc998/collection/collection.entity";

@Entity({ schema: ns, name: "staking_reward" })
export class StakingRewardEntity extends IdBaseEntity implements IStakingItem {
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
  @OneToOne(_type => StakingEntity)
  public stakingRule: StakingEntity;

  public erc20: UniTemplateEntity;
  public erc721: UniContractEntity;
  public erc998: UniContractEntity;
  public erc1155: UniContractEntity;
}
