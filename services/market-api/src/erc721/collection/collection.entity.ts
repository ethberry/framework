import { Column, Entity, OneToMany } from "typeorm";
import { Mixin } from "ts-mixer";

import { ContractBaseEntity, SearchableEntity } from "@gemunion/nest-js-module-typeorm-helpers";
import { Erc721CollectionStatus, Erc721CollectionType, IErc721Collection } from "@framework/types";
import { ns } from "@framework/constants";

import { Erc721TemplateEntity } from "../template/template.entity";

@Entity({ schema: ns, name: "erc721_collection" })
export class Erc721CollectionEntity extends Mixin(ContractBaseEntity, SearchableEntity) implements IErc721Collection {
  @Column({ type: "varchar" })
  public imageUrl: string;

  @Column({ type: "varchar" })
  public symbol: string;

  @Column({ type: "varchar" })
  public baseTokenURI: string;

  @Column({ type: "int" })
  public royalty: number;

  @Column({
    type: "enum",
    enum: Erc721CollectionStatus,
  })
  public collectionStatus: Erc721CollectionStatus;

  @Column({
    type: "enum",
    enum: Erc721CollectionType,
  })
  public collectionType: Erc721CollectionType;

  @OneToMany(_type => Erc721TemplateEntity, template => template.erc721Collection)
  public erc721Templates: Array<Erc721TemplateEntity>;
}
