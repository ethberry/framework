import { Column, Entity, OneToMany } from "typeorm";

import { ns } from "@framework/constants";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import { ILotteryRound } from "@framework/types";

import { LotteryTicketEntity } from "../ticket/ticket.entity";

@Entity({ schema: ns, name: "lottery_round" })
export class LotteryRoundEntity extends IdDateBaseEntity implements ILotteryRound {
  @Column({ type: "boolean", array: true })
  public numbers: Array<boolean>;

  @Column({ type: "numeric" })
  public roundId: string;

  @Column({ type: "numeric" })
  public contractId: number;

  @Column({ type: "numeric" })
  public maxTickets: number;

  @Column({ type: "timestamptz" })
  public startTimestamp: string;

  @Column({ type: "timestamptz" })
  public endTimestamp: string;

  @OneToMany(_type => LotteryTicketEntity, ticket => ticket.round)
  public tickets: Array<LotteryTicketEntity>;
}
