import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

import type { IToken } from "@framework/types";
import { TokenStatus } from "@framework/types";
import { ns } from "@framework/constants";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";

import { TemplateEntity } from "../template/template.entity";
import { BalanceEntity } from "../balance/balance.entity";
import { OwnershipEntity } from "../../tokens/erc998/ownership/ownership.entity";
import { ContractHistoryEntity } from "../../contract-history/contract-history.entity";

@Entity({ schema: ns, name: "token" })
export class TokenEntity extends IdDateBaseEntity implements IToken {
  @Column({ type: "json" })
  public attributes: any;

  @Column({ type: "numeric" })
  public tokenId: string;

  @Column({ type: "int" })
  public royalty: number;

  @Column({ type: "varchar", nullable: true })
  public cid: string | null;

  @Column({
    type: "enum",
    enum: TokenStatus,
  })
  public tokenStatus: TokenStatus;

  @Column({ type: "int" })
  public templateId: number;

  @JoinColumn()
  @ManyToOne(_type => TemplateEntity, template => template.tokens)
  public template: TemplateEntity;

  @OneToMany(_type => BalanceEntity, balance => balance.token)
  public balance: Array<BalanceEntity>;

  @OneToMany(_type => OwnershipEntity, ownership => ownership.child)
  public parent: Array<OwnershipEntity>;

  @OneToMany(_type => OwnershipEntity, ownership => ownership.parent)
  public children: Array<OwnershipEntity>;

  @OneToMany(_type => ContractHistoryEntity, history => history.token)
  public history: Array<ContractHistoryEntity>;
}
