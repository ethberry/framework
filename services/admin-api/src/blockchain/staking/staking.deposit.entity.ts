import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { Exclude } from "class-transformer";

import { ns } from "@framework/constants";
import { IStakingItem, TokenType } from "@framework/types";
import { IdBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";
import { StakingEntity } from "./staking.entity";
import { Erc20TokenEntity } from "../../erc20/token/token.entity";
import { Erc721CollectionEntity } from "../../erc721/collection/collection.entity";
import { Erc1155CollectionEntity } from "../../erc1155/collection/collection.entity";
import { Erc998CollectionEntity } from "../../erc998/collection/collection.entity";

@Entity({ schema: ns, name: "staking_deposit" })
export class StakingDepositEntity extends IdBaseEntity implements IStakingItem {
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

  // @Exclude()
  @Column({ type: "int" })
  public stakingId: number;

  @JoinColumn()
  @OneToOne(_type => StakingEntity)
  public staking: StakingEntity;

  public erc20: Erc20TokenEntity;
  public erc721: Erc721CollectionEntity;
  public erc998: Erc998CollectionEntity;
  public erc1155: Erc1155CollectionEntity;
}
