import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { ns } from "@framework/constants";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import { IBreedHistory } from "@framework/types";
import { ExchangeHistoryEntity } from "../../exchange/history/exchange-history.entity";
import { BreedEntity } from "../breed.entity";

@Entity({ schema: ns, name: "breed_history" })
export class BreedHistoryEntity extends IdDateBaseEntity implements IBreedHistory {
  @Column({ type: "varchar" })
  public account: string;

  @Column({ type: "int", nullable: true })
  public childId: number | null;

  @JoinColumn()
  @ManyToOne(_type => BreedEntity, breed => breed.childs)
  public child?: BreedEntity;

  @Column({ type: "int" })
  public matronId: number;

  @JoinColumn()
  @ManyToOne(_type => BreedEntity, breed => breed.matrons)
  public matron: BreedEntity;

  @Column({ type: "int" })
  public sireId: number;

  @JoinColumn()
  @ManyToOne(_type => BreedEntity, breed => breed.sires)
  public sire: BreedEntity;

  @Column({ type: "int" })
  public historyId: number;

  @JoinColumn()
  @ManyToOne(_type => ExchangeHistoryEntity)
  public history?: ExchangeHistoryEntity;
}
