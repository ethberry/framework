import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";

import { Erc721AuctionStatus, IErc721Auction } from "@framework/types";
import { ns } from "@framework/constants";
import { BigNumberColumn, IdBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";

import { Erc721CollectionEntity } from "../collection/collection.entity";
import { Erc721TokenEntity } from "../token/token.entity";
import { Erc721AuctionHistoryEntity } from "../auction-history/auction-history.entity";

@Entity({ schema: ns, name: "erc721_auction" })
export class Erc721AuctionEntity extends IdBaseEntity implements IErc721Auction {
  @Column({ type: "varchar" })
  public auctionId: string;

  @Column({ type: "varchar" })
  public owner: string;

  @Column({ type: "int" })
  public erc721CollectionId: number;

  @JoinColumn()
  @OneToOne(_type => Erc721CollectionEntity)
  public erc721Collection: Erc721CollectionEntity;

  @Column({ type: "int" })
  public erc721TokenId: number;

  @JoinColumn()
  @OneToOne(_type => Erc721TokenEntity, token => token.tokenId)
  public erc721Token: Erc721TokenEntity;

  @BigNumberColumn()
  public startPrice: string;

  @BigNumberColumn()
  public buyoutPrice: string;

  @BigNumberColumn()
  public price: string;

  @BigNumberColumn()
  public bidStep: string;

  @Column({ type: "timestamptz" })
  public startTimestamp: string;

  @Column({ type: "timestamptz" })
  public finishTimestamp: string;

  @Column({
    type: "enum",
    enum: Erc721AuctionStatus,
  })
  public auctionStatus: Erc721AuctionStatus;

  @OneToMany(_type => Erc721AuctionHistoryEntity, history => history.erc721Auction)
  public history: Array<Erc721AuctionHistoryEntity>;
}
