import { Column, Entity, OneToMany } from "typeorm";
import { Mixin } from "ts-mixer";

import { ContractBaseEntity, SearchableEntity } from "@gemunion/nest-js-module-typeorm-helpers";
import { UniContractStatus, Erc1155TokenTemplate, IErc1155Collection } from "@framework/types";
import { ns } from "@framework/constants";

import { UniTemplateEntity } from "../token/token.entity";

@Entity({ schema: ns, name: "erc1155_collection" })
export class UniContractEntity extends Mixin(ContractBaseEntity, SearchableEntity) implements IErc1155Collection {
  @Column({ type: "varchar" })
  public imageUrl: string;

  @Column({ type: "varchar" })
  public baseTokenURI: string;

  @Column({
    type: "enum",
    enum: UniContractStatus,
  })
  public contractStatus: UniContractStatus;

  @Column({
    type: "enum",
    enum: Erc1155TokenTemplate,
  })
  public contractTemplate: Erc1155TokenTemplate;

  @OneToMany(_type => UniTemplateEntity, token => token.erc1155Collection)
  public erc1155Tokens: Array<UniTemplateEntity>;
}
