import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { Erc721AuctionEventType, IErc721AuctionHistory, TErc721AuctionEventData } from "@framework/types";
import { ns } from "@framework/constants";
import { IdBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";

import { Erc721AuctionEntity } from "../auction/auction.entity";

@Entity({ schema: ns, name: "erc721_auction_history" })
export class Erc721AuctionHistoryEntity extends IdBaseEntity implements IErc721AuctionHistory {
  @Column({ type: "varchar" })
  public address: string;

  @Column({ type: "varchar" })
  public transactionHash: string;

  @Column({
    type: "enum",
    enum: Erc721AuctionEventType,
  })
  public eventType: Erc721AuctionEventType;

  @Column({ type: "json" })
  public eventData: TErc721AuctionEventData;

  @Column({ type: "int", nullable: true })
  public erc721AuctionId: number | null;

  @JoinColumn()
  @ManyToOne(_type => Erc721AuctionEntity, auction => auction.history)
  public erc721Auction?: Erc721AuctionEntity;
}
