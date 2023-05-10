import { Column, Entity, JoinColumn, OneToOne, OneToMany, ManyToOne } from "typeorm";

import { SearchableEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import type { IAchievementLevel } from "@framework/types";
import { ns } from "@framework/constants";

import { AchievementRuleEntity } from "../rule/rule.entity";
import { AssetEntity } from "../../blockchain/exchange/asset/asset.entity";
import { AchievementRedemptionEntity } from "../redemption/redemption.entity";

@Entity({ schema: ns, name: "achievement_level" })
export class AchievementLevelEntity extends SearchableEntity implements IAchievementLevel {
  @Column({ type: "int" })
  public achievementRuleId: number;

  @JoinColumn()
  @ManyToOne(_type => AchievementRuleEntity, rule => rule.levels)
  public achievementRule: AchievementRuleEntity;

  @Column({ type: "int" })
  public itemId: number;

  @JoinColumn()
  @OneToOne(_type => AssetEntity)
  public item: AssetEntity;

  @Column({ type: "int" })
  public amount: number;

  @Column({ type: "json" })
  public attributes: any;

  @Column({ type: "timestamptz" })
  public startTimestamp: string;

  @Column({ type: "timestamptz" })
  public endTimestamp: string;

  @JoinColumn()
  @OneToMany(_type => AchievementRedemptionEntity, component => component.achievementLevel)
  public redemptions: AchievementRedemptionEntity[];
}
