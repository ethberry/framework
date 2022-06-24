import { Column, Entity, OneToMany } from "typeorm";
import { Mixin } from "ts-mixer";

import { ContractBaseEntity, SearchableEntity } from "@gemunion/nest-js-module-typeorm-helpers";
import { Erc998CollectionStatus, Erc998CollectionType, Erc998TokenTemplate, IErc998Collection } from "@framework/types";
import { ns } from "@framework/constants";

import { Erc998TemplateEntity } from "../template/template.entity";

@Entity({ schema: ns, name: "erc998_collection" })
export class Erc998CollectionEntity extends Mixin(ContractBaseEntity, SearchableEntity) implements IErc998Collection {
  @Column({ type: "varchar" })
  public imageUrl: string;

  @Column({ type: "varchar" })
  public name: string;

  @Column({ type: "varchar" })
  public symbol: string;

  @Column({ type: "int" })
  public royalty: number;

  @Column({ type: "varchar" })
  public baseTokenURI: string;

  @Column({
    type: "enum",
    enum: Erc998CollectionStatus,
  })
  public collectionStatus: Erc998CollectionStatus;

  @Column({
    type: "enum",
    enum: Erc998CollectionType,
  })
  public collectionType: Erc998CollectionType;

  @Column({
    type: "enum",
    enum: Erc998TokenTemplate,
  })
  public contractTemplate: Erc998TokenTemplate;

  @OneToMany(_type => Erc998TemplateEntity, template => template.erc998Collection)
  public erc998Templates: Array<Erc998TemplateEntity>;
}
