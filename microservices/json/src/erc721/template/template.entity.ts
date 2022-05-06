import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

import { Erc721TemplateStatus, IErc721Template } from "@framework/types";
import { ns } from "@framework/constants";
import { BigNumberColumn, SearchableEntity } from "@gemunion/nest-js-module-typeorm-helpers";

import { Erc721CollectionEntity } from "../collection/collection.entity";
import { Erc721TokenEntity } from "../token/token.entity";

@Entity({ schema: ns, name: "erc721_template" })
export class Erc721TemplateEntity extends SearchableEntity implements IErc721Template {
  @Column({ type: "varchar" })
  public imageUrl: string;

  @Column({ type: "json" })
  public attributes: any;

  @BigNumberColumn()
  public price: string;

  @Column({
    type: "enum",
    enum: Erc721TemplateStatus,
  })
  public templateStatus: Erc721TemplateStatus;

  @Column({ type: "int" })
  public erc721CollectionId: number;

  @JoinColumn()
  @ManyToOne(_type => Erc721CollectionEntity)
  public erc721Collection: Erc721CollectionEntity;

  @OneToMany(_type => Erc721TokenEntity, token => token.erc721Template)
  public erc721Tokens: Array<Erc721TokenEntity>;
}
