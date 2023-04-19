import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { SearchableEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import type { IAchievementLevel } from "@framework/types";
import { ns } from "@framework/constants";

import { AchievementRuleEntity } from "../rule/rule.entity";
import { AssetEntity } from "../../blockchain/exchange/asset/asset.entity";

@Entity({ schema: ns, name: "achievement_level" })
export class AchievementLevelEntity extends SearchableEntity implements IAchievementLevel {
  @Column({ type: "int" })
  public achievementRuleId: number;

  @JoinColumn()
  @OneToOne(_type => AchievementRuleEntity)
  public achievementRule: AchievementRuleEntity;

  @Column({ type: "int" })
  public itemId: number;

  @JoinColumn()
  @OneToOne(_type => AssetEntity)
  public item: AssetEntity;

  @Column({ type: "int" })
  public amount: number;
}
