import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { ns } from "@framework/constants";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import type { ILotteryTicket } from "@framework/types";

import { TokenEntity } from "../../../../hierarchy/token/token.entity";

@Entity({ schema: ns, name: "lottery_ticket" })
export class LotteryTicketEntity extends IdDateBaseEntity implements ILotteryTicket {
  @Column({ type: "varchar" })
  public account: string;

  @Column({ type: "boolean", array: true })
  public numbers: Array<boolean>;

  @Column({ type: "int" })
  public roundId: number;

  @Column({ type: "int" })
  public tokenId: number;

  @JoinColumn()
  @OneToOne(_type => TokenEntity)
  public token: TokenEntity;
}
