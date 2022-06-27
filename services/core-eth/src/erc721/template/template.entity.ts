import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

import { UniTemplateStatus, IErc721Template } from "@framework/types";
import { ns } from "@framework/constants";
import { BigNumberColumn, SearchableEntity } from "@gemunion/nest-js-module-typeorm-helpers";

import { UniContractEntity } from "../collection/collection.entity";
import { UniTokenEntity } from "../token/token.entity";
import { Erc721AirdropEntity } from "../airdrop/airdrop.entity";

@Entity({ schema: ns, name: "erc721_template" })
export class UniTemplateEntity extends SearchableEntity implements IErc721Template {
  @Column({ type: "varchar" })
  public imageUrl: string;

  @Column({ type: "json" })
  public attributes: any;

  @BigNumberColumn()
  public price: string;

  @Column({ type: "int" })
  public amount: number;

  @Column({ type: "int" })
  public instanceCount: number;

  @Column({
    type: "enum",
    enum: UniTemplateStatus,
  })
  public templateStatus: UniTemplateStatus;

  @Column({ type: "int" })
  public erc721CollectionId: number;

  @JoinColumn()
  @ManyToOne(_type => UniContractEntity)
  public erc721Collection: UniContractEntity;

  @OneToMany(_type => UniTokenEntity, token => token.erc721Template)
  public erc721Tokens: Array<UniTokenEntity>;

  @OneToMany(_type => Erc721AirdropEntity, dropbox => dropbox.erc721Template)
  public erc721Airdrops: Array<Erc721AirdropEntity>;
}
