import { Column, Entity } from "typeorm";

import { ns } from "@framework/constants";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";

@Entity({ schema: ns, name: "lottery_round" })
export class LotteryTicketEntity extends IdDateBaseEntity {
  @Column({ type: "int" })
  public ticketNumbers: Array<number>;
}
