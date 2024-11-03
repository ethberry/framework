import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { SearchableEntity } from "@ethberry/nest-js-module-typeorm-postgres";
import { ns } from "@framework/constants";
import { IVestingBox, ShapeType, VestingBoxStatus, VestingType } from "@framework/types";

import { TemplateEntity } from "../../../../hierarchy/template/template.entity";
import { AssetEntity } from "../../../../exchange/asset/asset.entity";

@Entity({ schema: ns, name: "vesting_box" })
export class VestingBoxEntity extends SearchableEntity implements IVestingBox {
  @Column({ type: "varchar" })
  public imageUrl: string;

  @JoinColumn()
  @OneToOne(_type => AssetEntity)
  public content: AssetEntity;

  @Column({ type: "int" })
  public contentId: number;

  @Column({
    type: "enum",
    enum: VestingBoxStatus,
  })
  public vestingBoxStatus: VestingBoxStatus;

  @Column({ type: "int" })
  public templateId: number;

  @JoinColumn()
  @OneToOne(_type => TemplateEntity)
  public template: TemplateEntity;

  @Column({
    type: "enum",
    enum: VestingType,
  })
  public functionType: VestingType;

  @Column({
    type: "enum",
    enum: ShapeType,
  })
  public shape: ShapeType;

  @Column({ type: "int" })
  public cliff: number;

  @Column({ type: "timestamptz" })
  public startTimestamp: string;

  @Column({ type: "int" })
  public duration: number;

  @Column({ type: "int" })
  public period: number;

  @Column({ type: "int" })
  public afterCliffBasisPoints: number;

  @Column({ type: "int" })
  public growthRate: number;
}
