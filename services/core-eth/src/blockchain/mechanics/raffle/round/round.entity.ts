import { Column, Entity, OneToMany } from "typeorm";

import { ns } from "@framework/constants";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import { IRaffleRound } from "@framework/types";

import { RaffleTicketEntity } from "../ticket/ticket.entity";

@Entity({ schema: ns, name: "raffle_round" })
export class RaffleRoundEntity extends IdDateBaseEntity implements IRaffleRound {
  @Column({ type: "boolean", array: true })
  public numbers: Array<boolean>;

  @Column({ type: "numeric" })
  public roundId: string;

  @Column({ type: "numeric" })
  public contractId: number;

  @Column({ type: "timestamptz" })
  public startTimestamp: string;

  @Column({ type: "timestamptz" })
  public endTimestamp: string;

  @OneToMany(_type => RaffleTicketEntity, ticket => ticket.round)
  public tickets: Array<RaffleTicketEntity>;
}
