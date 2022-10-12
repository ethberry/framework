import { Column, Entity } from "typeorm";

import { ns } from "@framework/constants";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import { IBreedHistory } from "@framework/types";

@Entity({ schema: ns, name: "breed_history" })
export class BreedHistoryEntity extends IdDateBaseEntity implements IBreedHistory {
  @Column({ type: "varchar" })
  public account: string;

  @Column({ type: "int", nullable: true })
  public childId: number | null;

  @Column({ type: "int" })
  public matronId: number;

  @Column({ type: "int" })
  public sireId: number;
}
