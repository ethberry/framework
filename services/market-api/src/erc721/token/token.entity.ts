import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";

import { Erc721TokenStatus, IErc721Token, TokenRarity } from "@framework/types";
import { ns } from "@framework/constants";
import { BigNumberColumn, IdBaseEntity, JsonColumn } from "@gemunion/nest-js-module-typeorm-helpers";

import { Erc721TemplateEntity } from "../template/template.entity";
import { Erc721TokenHistoryEntity } from "../token-history/token-history.entity";
import { Erc721AuctionEntity } from "../auction/auction.entity";
import { Erc721DropboxEntity } from "../dropbox/dropbox.entity";

@Entity({ schema: ns, name: "erc721_token" })
export class Erc721TokenEntity extends IdBaseEntity implements IErc721Token {
  @JsonColumn()
  public attributes: any;

  @Column({
    type: "enum",
    enum: TokenRarity,
  })
  public rarity: TokenRarity;

  @Column({
    type: "enum",
    enum: Erc721TokenStatus,
  })
  public tokenStatus: Erc721TokenStatus;

  @BigNumberColumn()
  public tokenId: string;

  @Column({ type: "varchar" })
  public owner: string;

  @Column({ type: "int" })
  public erc721TemplateId: number;

  @JoinColumn()
  @ManyToOne(_type => Erc721TemplateEntity, template => template.erc721Tokens)
  public erc721Template: Erc721TemplateEntity;

  @Column({ type: "int" })
  public erc721DropboxId: number;

  @JoinColumn()
  @ManyToOne(_type => Erc721DropboxEntity, dropbox => dropbox.erc721Tokens)
  public erc721Dropbox: Erc721DropboxEntity;

  @Column({ type: "int" })
  public erc721TokenId: number;

  @JoinColumn()
  @OneToOne(_type => Erc721TokenEntity, dropbox => dropbox.erc721Token)
  public erc721Token: Erc721TokenEntity;

  @OneToOne(_type => Erc721AuctionEntity, auction => auction.erc721Token)
  public erc721Auction: Erc721AuctionEntity;

  @OneToMany(_type => Erc721TokenHistoryEntity, history => history.erc721Token)
  public history: Array<Erc721TokenHistoryEntity>;
}
