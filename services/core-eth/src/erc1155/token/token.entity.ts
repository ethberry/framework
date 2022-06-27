import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { UniTemplateStatus, IErc1155Token } from "@framework/types";
import { ns } from "@framework/constants";
import { BigNumberColumn, SearchableEntity } from "@gemunion/nest-js-module-typeorm-helpers";

import { UniContractEntity } from "../collection/collection.entity";

@Entity({ schema: ns, name: "erc1155_token" })
export class UniTemplateEntity extends SearchableEntity implements IErc1155Token {
  @Column({ type: "json" })
  public attributes: any;

  @BigNumberColumn()
  public price: string;

  @Column({ type: "int" })
  public amount: number;

  @Column({ type: "int" })
  public instanceCount: number;

  @Column({ type: "varchar" })
  public imageUrl: string;

  @BigNumberColumn()
  public tokenId: string;

  @Column({
    type: "enum",
    enum: UniTemplateStatus,
  })
  public tokenStatus: UniTemplateStatus;

  @Column({ type: "int" })
  public erc1155CollectionId: number;

  @JoinColumn()
  @ManyToOne(_type => UniContractEntity, collection => collection.erc1155Tokens)
  public erc1155Collection: UniContractEntity;
}
