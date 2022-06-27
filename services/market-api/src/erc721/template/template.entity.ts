import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

import { Erc721TemplateStatus, IErc721Template } from "@framework/types";
import { ns } from "@framework/constants";
import { BigNumberColumn, JsonColumn, SearchableEntity } from "@gemunion/nest-js-module-typeorm-helpers";

import { Erc721CollectionEntity } from "../collection/collection.entity";
import { Erc721TokenEntity } from "../token/token.entity";
import { Erc721AirdropEntity } from "../airdrop/airdrop.entity";
import { Erc20TokenEntity } from "../../erc20/token/token.entity";

@Entity({ schema: ns, name: "erc721_template" })
export class Erc721TemplateEntity extends SearchableEntity implements IErc721Template {
  @Column({ type: "varchar" })
  public imageUrl: string;

  @JsonColumn()
  public attributes: any;

  @BigNumberColumn()
  public price: string;

  @Column({ type: "int" })
  public amount: number;

  @Column({ type: "int" })
  public instanceCount: number;

  @Column({
    type: "enum",
    enum: Erc721TemplateStatus,
  })
  public templateStatus: Erc721TemplateStatus;

  @Column({ type: "int" })
  public erc20TokenId: number;

  @JoinColumn()
  @ManyToOne(_type => Erc20TokenEntity)
  public erc20Token: Erc20TokenEntity;

  @Column({ type: "int" })
  public erc721CollectionId: number;

  @JoinColumn()
  @ManyToOne(_type => Erc721CollectionEntity)
  public erc721Collection: Erc721CollectionEntity;

  @OneToMany(_type => Erc721TokenEntity, token => token.erc721Template)
  public erc721Tokens: Array<Erc721TokenEntity>;

  @OneToMany(_type => Erc721AirdropEntity, dropbox => dropbox.erc721Template)
  public erc721Airdrops: Array<Erc721AirdropEntity>;
}
