import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";

import { ns } from "@framework/constants";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import { IRaffleTicket } from "@framework/types";

import { RaffleRoundEntity } from "../round/round.entity";
import { TokenEntity } from "../../../hierarchy/token/token.entity";

@Entity({ schema: ns, name: "raffle_ticket" })
export class RaffleTicketEntity extends IdDateBaseEntity implements IRaffleTicket {
  @Column({ type: "varchar" })
  public account: string;

  @Column({ type: "int" })
  public roundId: number;

  @JoinColumn()
  @ManyToOne(_type => RaffleRoundEntity, round => round.tickets)
  public round: RaffleRoundEntity;

  @Column({ type: "int" })
  public tokenId: number;

  @JoinColumn()
  @OneToOne(_type => TokenEntity)
  public token: TokenEntity;

  @Column({ type: "numeric" })
  public amount: string;
}
