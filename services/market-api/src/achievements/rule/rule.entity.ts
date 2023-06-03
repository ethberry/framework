import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";

import { SearchableEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import type { IAchievementRule } from "@framework/types";
import { AchievementRuleStatus, AchievementType, ContractEventType } from "@framework/types";
import { ns } from "@framework/constants";

import { AchievementLevelEntity } from "../level/level.entity";
import { ContractEntity } from "../../blockchain/hierarchy/contract/contract.entity";
import { AssetEntity } from "../../blockchain/exchange/asset/asset.entity";
import { AchievementItemEntity } from "../item/item.entity";

@Entity({ schema: ns, name: "achievement_rule" })
export class AchievementRuleEntity extends SearchableEntity implements IAchievementRule {
  @Column({
    type: "enum",
    enum: AchievementType,
  })
  public achievementType: AchievementType;

  @Column({
    type: "enum",
    enum: ContractEventType,
  })
  public eventType: ContractEventType | null;

  @Column({ type: "int", nullable: true })
  public contractId: number | null;

  @JoinColumn()
  @ManyToOne(_type => ContractEntity)
  public contract: ContractEntity;

  @Column({ type: "int", nullable: true })
  public itemId: number | null;

  @JoinColumn()
  @OneToOne(_type => AssetEntity)
  public item: AssetEntity;

  @Column({
    type: "enum",
    enum: AchievementRuleStatus,
  })
  public achievementStatus: AchievementRuleStatus;

  @OneToMany(_type => AchievementLevelEntity, component => component.achievementRule)
  public levels: Array<AchievementLevelEntity>;

  @OneToMany(_type => AchievementItemEntity, item => item.achievementRule)
  public items: Array<AchievementItemEntity>;
}
