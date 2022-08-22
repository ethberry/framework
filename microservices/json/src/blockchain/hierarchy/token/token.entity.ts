import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { IToken, TokenStatus } from "@framework/types";
import { ns } from "@framework/constants";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";

import { TemplateEntity } from "../template/template.entity";

@Entity({ schema: ns, name: "token" })
export class TokenEntity extends IdDateBaseEntity implements IToken {
  @Column({ type: "json" })
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
}
