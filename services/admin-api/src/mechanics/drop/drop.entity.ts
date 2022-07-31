import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";
import { ns } from "@framework/constants";
import { IDrop } from "@framework/types";

import { TemplateEntity } from "../../blockchain/hierarchy/template/template.entity";

@Entity({ schema: ns, name: "drop" })
export class DropEntity extends IdDateBaseEntity implements IDrop {
  @Column({ type: "int" })
  public templateId: number;

  @JoinColumn()
  @OneToOne(_type => TemplateEntity)
  public template: TemplateEntity;

  @Column({ type: "timestamptz" })
  public startTimestamp: string;

  @Column({ type: "timestamptz" })
  public endTimestamp: string;
}
