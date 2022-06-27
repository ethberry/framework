import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

import { UniTemplateStatus, IErc998Template } from "@framework/types";
import { ns } from "@framework/constants";
import { BigNumberColumn, SearchableEntity } from "@gemunion/nest-js-module-typeorm-helpers";

import { UniContractEntity } from "../collection/collection.entity";
import { Erc998TokenEntity } from "../token/token.entity";
import { Erc998AirdropEntity } from "../airdrop/airdrop.entity";

@Entity({ schema: ns, name: "erc998_template" })
export class UniTemplateEntity extends SearchableEntity implements IErc998Template {
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
  public erc998CollectionId: number;

  @JoinColumn()
  @ManyToOne(_type => UniContractEntity)
  public erc998Collection: UniContractEntity;

  @OneToMany(_type => Erc998TokenEntity, token => token.erc998Template)
  public erc998Tokens: Array<Erc998TokenEntity>;

  @OneToMany(_type => Erc998AirdropEntity, dropbox => dropbox.erc998Template)
  public erc998Airdrops: Array<Erc998AirdropEntity>;
}
