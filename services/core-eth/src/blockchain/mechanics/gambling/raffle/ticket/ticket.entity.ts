import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { ns } from "@framework/constants";
import { IdDateBaseEntity } from "@ethberry/nest-js-module-typeorm-postgres";
import type { IRaffleTicket } from "@framework/types";
import { TokenEntity } from "../../../../hierarchy/token/token.entity";

@Entity({ schema: ns, name: "raffle_ticket" })
export class RaffleTicketEntity extends IdDateBaseEntity implements IRaffleTicket {
  @Column({ type: "varchar" })
  public account: string;

  @Column({ type: "int" })
  public roundId: number;

  @Column({ type: "int" })
  public tokenId: number;

  @JoinColumn()
  @OneToOne(_type => TokenEntity)
  public token: TokenEntity;
}
