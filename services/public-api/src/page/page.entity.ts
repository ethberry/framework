import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

import { IPage, PageStatus } from "@gemunion/framework-types";
import { ns } from "@gemunion/framework-constants";
import { GemunionBaseEntity } from "@gemunion/nest-js-module-typeorm";

@Entity({ schema: ns, name: "page" })
export class PageEntity extends GemunionBaseEntity implements IPage {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: "varchar", unique: true })
  public slug: string;

  @Column({ type: "varchar" })
  public title: string;

  @Column({
    type: "json",
    transformer: {
      from(val: Record<string, any>) {
        return JSON.stringify(val);
      },
      to(val: string) {
        return JSON.parse(val) as Record<string, any>;
      },
    },
  })
  public description: string;

  @Column({
    type: "enum",
    enum: PageStatus,
  })
  public pageStatus: PageStatus;
}
