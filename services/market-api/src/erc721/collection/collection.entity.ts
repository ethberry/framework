import { Column, Entity, OneToMany } from "typeorm";

import { Erc721CollectionStatus, Erc721CollectionType, IErc721Collection } from "@framework/types";
import { ns } from "@framework/constants";
import { OzContractBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";

import { Erc721TemplateEntity } from "../template/template.entity";

@Entity({ schema: ns, name: "erc721_collection" })
export class Erc721CollectionEntity extends OzContractBaseEntity implements IErc721Collection {
  @Column({ type: "varchar" })
  public imageUrl: string;

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
