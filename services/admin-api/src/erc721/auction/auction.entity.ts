import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { Erc721AuctionStatus, IErc721Auction } from "@framework/types";
import { ns } from "@framework/constants";
import { BigNumberColumn, IdBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";

import { Erc721CollectionEntity } from "../collection/collection.entity";
import { Erc721TokenEntity } from "../token/token.entity";

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
  @OneToOne(_type => Erc721TokenEntity)
  public erc721Token: Erc721TokenEntity;

  @Column({ type: "varchar" })
  public startPrice: string;

  @Column({ type: "varchar" })
  public buyoutPrice: string;

  @BigNumberColumn()
  public price: string;

  @Column({ type: "varchar" })
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
}
