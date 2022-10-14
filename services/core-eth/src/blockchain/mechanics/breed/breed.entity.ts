import { Column, Entity, JoinColumn, OneToOne, OneToMany } from "typeorm";

import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import { IBreed } from "@framework/types";
import { ns } from "@framework/constants";
import { TokenEntity } from "../../hierarchy/token/token.entity";
import { BreedHistoryEntity } from "./history/history.entity";

@Entity({ schema: ns, name: "breed" })
export class BreedEntity extends IdDateBaseEntity implements IBreed {
  @Column({ type: "varchar" })
  public genes: string;

  @Column({ type: "int" })
  public count: number;

  @Column({ type: "int" })
  public tokenId: number;

  @JoinColumn()
  @OneToOne(_type => TokenEntity)
  public token: TokenEntity;

  @OneToMany(_type => BreedHistoryEntity, breeds => breeds.child)
  public childs?: Array<BreedHistoryEntity>;

  @OneToMany(_type => BreedHistoryEntity, breeds => breeds.child)
  public matrons?: Array<BreedHistoryEntity>;

  @OneToMany(_type => BreedHistoryEntity, breeds => breeds.child)
  public sires?: Array<BreedHistoryEntity>;
}
