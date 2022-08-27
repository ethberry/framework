import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

import { ns } from "@framework/constants";
import { ExchangeEventType, IExchangeHistory, TExchangeEventData } from "@framework/types";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";

import { TemplateEntity } from "../../../hierarchy/template/template.entity";
import { ClaimEntity } from "../../claim/claim.entity";
import { CraftEntity } from "../../craft/craft.entity";
import { GradeEntity } from "../../grade/grade.entity";
import { MysteryboxBoxEntity } from "../../mysterybox/mysterybox.entity";
import { AssetComponentHistoryEntity } from "../../asset/asset-component-history.entity";

@Entity({ schema: ns, name: "exchange_history" })
export class ExchangeHistoryEntity extends IdDateBaseEntity implements IExchangeHistory {
  @Column({ type: "varchar" })
  public address: string;

  @Column({ type: "varchar" })
  public transactionHash: string;

  @Column({
    type: "enum",
    enum: ExchangeEventType,
  })
  public eventType: ExchangeEventType;

  @Column({ type: "json" })
  public eventData: TExchangeEventData;

  @Column({ type: "int", nullable: true })
  public templateId: number | null;

  @JoinColumn()
  @ManyToOne(_type => TemplateEntity)
  public template?: TemplateEntity;

  // MODULE:CLAIM
  @Column({ type: "int", nullable: true })
  public claimId: number | null;

  @JoinColumn()
  @ManyToOne(_type => ClaimEntity)
  public claim?: ClaimEntity;

  // MODULE:CRAFT
  @Column({ type: "int", nullable: true })
  public craftId: number | null;

  @JoinColumn()
  @ManyToOne(_type => CraftEntity)
  public craft?: CraftEntity;

  // MODULE:GRADE
  @Column({ type: "int", nullable: true })
  public gradeId: number | null;

  @JoinColumn()
  @ManyToOne(_type => GradeEntity)
  public grade?: GradeEntity;

  // MODULE:MYSTERYBOX
  @Column({ type: "int", nullable: true })
  public mysteryboxId: number | null;

  @JoinColumn()
  @ManyToOne(_type => MysteryboxBoxEntity)
  public mysterybox?: MysteryboxBoxEntity;

  @OneToMany(_type => AssetComponentHistoryEntity, assets => assets.history)
  public assets: Array<AssetComponentHistoryEntity>;
}
