import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";

import { SearchableEntity } from "@ethberry/nest-js-module-typeorm-postgres";
import type { IAchievementRule } from "@framework/types";
import { AchievementRuleStatus, TContractEventType } from "@framework/types";
import { ns } from "@framework/constants";

import { AchievementLevelEntity } from "../level/level.entity";
import { ContractEntity } from "../../../../hierarchy/contract/contract.entity";
import { AssetEntity } from "../../../../exchange/asset/asset.entity";

@Entity({ schema: ns, name: "achievement_rule" })
export class AchievementRuleEntity extends SearchableEntity implements IAchievementRule {
  @Column({
    type: "varchar",
    // enum: TContractEventType,
  })
  public eventType: TContractEventType | null;

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

  @Column({ type: "timestamptz" })
  public startTimestamp: string;

  @Column({ type: "timestamptz" })
  public endTimestamp: string;

  @OneToMany(_type => AchievementLevelEntity, component => component.achievementRule)
  public levels: Array<AchievementLevelEntity>;
}
