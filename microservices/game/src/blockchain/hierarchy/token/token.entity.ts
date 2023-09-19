import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

import type { IToken } from "@framework/types";
import { TokenStatus } from "@framework/types";
import { ns } from "@framework/constants";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";

import { TemplateEntity } from "../template/template.entity";
import { BalanceEntity } from "../balance/balance.entity";

@Entity({ schema: ns, name: "token" })
export class TokenEntity extends IdDateBaseEntity implements IToken {
  @Column({ type: "varchar", nullable: true })
  public imageUrl: string | null;

  @Column({ type: "json" })
  public metadata: any;

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
}
