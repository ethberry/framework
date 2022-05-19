import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

import { DraftColumn } from "@gemunion/nest-js-module-typeorm-helpers";
import { ns } from "@framework/constants";

@Entity({ schema: ns, name: "uni_token" })
export class UniTokenEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: "varchar" })
  public title: string;

  @DraftColumn()
  public description: string;

  @Column({ type: "varchar" })
  public imageUrl: string;

  @Column({ type: "int" })
  public amount: number;

  @Column({ type: "int" })
  public owned: number;

  @Column({ type: "varchar", select: false })
  public owner: string;
}
