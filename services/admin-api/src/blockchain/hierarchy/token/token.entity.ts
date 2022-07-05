import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

import { IToken, TokenStatus } from "@framework/types";
import { ns } from "@framework/constants";
import { IdDateBaseEntity, JsonColumn } from "@gemunion/nest-js-module-typeorm-helpers";

import { TemplateEntity } from "../template/template.entity";
import { BalanceEntity } from "../balance/balance.entity";

@Entity({ schema: ns, name: "token" })
export class TokenEntity extends IdDateBaseEntity implements IToken {
  @JsonColumn()
  public attributes: any;

  @Column({
    type: "enum",
    enum: TokenStatus,
  })
  public tokenStatus: TokenStatus;

  @Column({ type: "numeric" })
  public tokenId: string;

  @Column({ type: "int" })
  public royalty: number;

  @Column({ type: "int" })
  public templateId: number;

  @JoinColumn()
  @ManyToOne(_type => TemplateEntity, template => template.tokens)
  public template: TemplateEntity;

  @OneToMany(_type => BalanceEntity, balance => balance.token)
  public balance: BalanceEntity;
}
