import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";

import { ns } from "@framework/constants";
import { Erc998AirdropStatus, IErc998Airdrop } from "@framework/types";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";

import { Erc998TemplateEntity } from "../template/template.entity";
import { Erc998TokenEntity } from "../token/token.entity";

@Entity({ schema: ns, name: "erc998_air_drop" })
export class Erc998AirdropEntity extends IdDateBaseEntity implements IErc998Airdrop {
  @Column({ type: "varchar" })
  public owner: string;

  @Column({ type: "int" })
  public erc998TemplateId: number;

  @JoinColumn()
  @ManyToOne(_type => Erc998TemplateEntity, template => template.erc998Airdrops)
  public erc998Template: Erc998TemplateEntity;

  @Column({ type: "int" })
  public erc998TokenId: number;

  @JoinColumn()
  @OneToOne(_type => Erc998TokenEntity, token => token.id)
  public erc998Token: Erc998TokenEntity;

  @Column({
    type: "enum",
    enum: Erc998AirdropStatus,
  })
  public airdropStatus: Erc998AirdropStatus;

  @Column({ type: "varchar" })
  public signature: string;
}
