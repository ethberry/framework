import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

import { Erc998TemplateStatus, IErc998Template } from "@framework/types";
import { ns } from "@framework/constants";
import { BigNumberColumn, SearchableEntity } from "@gemunion/nest-js-module-typeorm-helpers";

import { Erc998CollectionEntity } from "../collection/collection.entity";
import { Erc998TokenEntity } from "../token/token.entity";

@Entity({ schema: ns, name: "erc998_template" })
export class Erc998TemplateEntity extends SearchableEntity implements IErc998Template {
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
    enum: Erc998TemplateStatus,
  })
  public templateStatus: Erc998TemplateStatus;

  @Column({ type: "int" })
  public erc998CollectionId: number;

  @JoinColumn()
  @ManyToOne(_type => Erc998CollectionEntity)
  public erc998Collection: Erc998CollectionEntity;

  @OneToMany(_type => Erc998TokenEntity, token => token.erc998Template)
  public erc998Tokens: Array<Erc998TokenEntity>;
}
