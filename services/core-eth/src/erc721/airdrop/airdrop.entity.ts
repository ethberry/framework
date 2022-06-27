import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";

import { ns } from "@framework/constants";
import { Erc721AirdropStatus, IErc721Airdrop } from "@framework/types";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";

import { UniTemplateEntity } from "../template/template.entity";
import { UniTokenEntity } from "../token/token.entity";

@Entity({ schema: ns, name: "erc721_air_drop" })
export class Erc721AirdropEntity extends IdDateBaseEntity implements IErc721Airdrop {
  @Column({ type: "varchar" })
  public owner: string;

  @Column({ type: "int" })
  public erc721TemplateId: number;

  @JoinColumn()
  @ManyToOne(_type => UniTemplateEntity, template => template.erc721Airdrops)
  public erc721Template: UniTemplateEntity;

  @Column({ type: "int" })
  public erc721TokenId: number;

  @JoinColumn()
  @OneToOne(_type => UniTokenEntity, token => token.id)
  public erc721Token: UniTokenEntity;

  @Column({
    type: "enum",
    enum: Erc721AirdropStatus,
  })
  public airdropStatus: Erc721AirdropStatus;

  @Column({ type: "varchar" })
  public signature: string;
}
