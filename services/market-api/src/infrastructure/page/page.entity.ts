import { Column, Entity } from "typeorm";

import { SearchableEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import type { IPage } from "@framework/types";
import { PageStatus } from "@framework/types";
import { ns } from "@framework/constants";

@Entity({ schema: ns, name: "page" })
export class PageEntity extends SearchableEntity implements IPage {
  @Column({ type: "varchar", unique: true })
  public slug: string;

  @Column({
    type: "enum",
    enum: PageStatus,
  })
  public pageStatus: PageStatus;
}
