import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import { IBreed } from "@framework/types";
import { ns } from "@framework/constants";
import { TokenEntity } from "../../hierarchy/token/token.entity";

@Entity({ schema: ns, name: "breed_genes" })
export class BreedEntity extends IdDateBaseEntity implements IBreed {
  @Column({ type: "varchar" })
  public genes: string;

  @Column({ type: "int" })
  public count: number;

  @Column({ type: "int", nullable: true })
  public tokenId: number | null;

  @JoinColumn()
  @OneToOne(_type => TokenEntity)
  public token?: TokenEntity;
}
