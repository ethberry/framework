import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

import type { IToken } from "@framework/types";
import { TokenStatus } from "@framework/types";
import { ns } from "@framework/constants";
import { IdDateBaseEntity } from "@ethberry/nest-js-module-typeorm-postgres";

import { TemplateEntity } from "../template/template.entity";
import { BalanceEntity } from "../balance/balance.entity";
import { AssetComponentHistoryEntity } from "../../exchange/asset/asset-component-history.entity";
import { BreedEntity } from "../../mechanics/gaming/breed/breed.entity";
import { EventHistoryEntity } from "../../event-history/event-history.entity";

@Entity({ schema: ns, name: "token" })
export class TokenEntity extends IdDateBaseEntity implements IToken {
  @Column({ type: "varchar", nullable: true })
  public imageUrl: string | null;

  @Column({ type: "json" })
  public metadata: any;

  @Column({ type: "numeric" })
  public tokenId: bigint;

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

  @OneToMany(_type => AssetComponentHistoryEntity, history => history.token)
  public exchange: Array<AssetComponentHistoryEntity>;

  @OneToMany(_type => EventHistoryEntity, history => history.token)
  public history: Array<EventHistoryEntity>;

  @OneToMany(_type => BreedEntity, breed => breed.token)
  public breeds: Array<BreedEntity>;
}
