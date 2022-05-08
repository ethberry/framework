import { Column, Entity, OneToMany } from "typeorm";
import { Mixin } from "ts-mixer";

import { OzContractBaseEntity, SearchableEntity } from "@gemunion/nest-js-module-typeorm-helpers";
import { Erc1155CollectionStatus, IErc1155Collection } from "@framework/types";
import { ns } from "@framework/constants";

import { Erc1155TokenEntity } from "../token/token.entity";

@Entity({ schema: ns, name: "erc1155_collection" })
export class Erc1155CollectionEntity
  extends Mixin(OzContractBaseEntity, SearchableEntity)
  implements IErc1155Collection
{
  @Column({ type: "varchar" })
  public imageUrl: string;

  @Column({
    type: "enum",
    enum: Erc1155CollectionStatus,
  })
  public collectionStatus: Erc1155CollectionStatus;

  @OneToMany(_type => Erc1155TokenEntity, token => token.erc1155Collection)
  public erc1155Tokens: Array<Erc1155TokenEntity>;
}
