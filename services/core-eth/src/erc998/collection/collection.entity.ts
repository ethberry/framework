import { Column, Entity, OneToMany } from "typeorm";
import { Mixin } from "ts-mixer";

import { ContractBaseEntity, SearchableEntity } from "@gemunion/nest-js-module-typeorm-helpers";
import { UniContractStatus, UniContractType, Erc998TokenTemplate, IErc998Collection } from "@framework/types";
import { ns } from "@framework/constants";

import { UniTemplateEntity } from "../template/template.entity";

@Entity({ schema: ns, name: "erc998_collection" })
export class UniContractEntity extends Mixin(ContractBaseEntity, SearchableEntity) implements IErc998Collection {
  @Column({ type: "varchar" })
  public imageUrl: string;

  @Column({ type: "varchar" })
  public name: string;

  @Column({ type: "varchar" })
  public symbol: string;

  @Column({ type: "varchar" })
  public baseTokenURI: string;

  @Column({ type: "int" })
  public royalty: number;

  @Column({
    type: "enum",
    enum: UniContractStatus,
  })
  public contractStatus: UniContractStatus;

  @Column({
    type: "enum",
    enum: UniContractType,
  })
  public collectionType: UniContractType;

  @Column({
    type: "enum",
    enum: Erc998TokenTemplate,
  })
  public contractTemplate: Erc998TokenTemplate;

  @OneToMany(_type => UniTemplateEntity, template => template.erc998Collection)
  public erc998Templates: Array<UniTemplateEntity>;
}
