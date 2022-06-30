import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { IUniToken, UniTokenStatus } from "@framework/types";
import { ns } from "@framework/constants";
import { BigNumberColumn, IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";

import { UniTemplateEntity } from "../uni-template/uni-template.entity";

@Entity({ schema: ns, name: "uni_token" })
export class UniTokenEntity extends IdDateBaseEntity implements IUniToken {
  @Column({ type: "json" })
  public attributes: any;

  @Column({
    type: "enum",
    enum: UniTokenStatus,
  })
  public tokenStatus: UniTokenStatus;

  @BigNumberColumn()
  public tokenId: string;

  @Column({ type: "varchar" })
  public owner: string;

  @Column({ type: "int" })
  public uniTemplateId: number;

  @Column({ type: "int" })
  public royalty: number;

  @JoinColumn()
  @ManyToOne(_type => UniTemplateEntity, template => template.uniTokens)
  public uniTemplate: UniTemplateEntity;
}
