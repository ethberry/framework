import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

import { ns } from "@framework/constants";
import { DropboxStatus, IErc998Dropbox } from "@framework/types";
import { BigNumberColumn, SearchableEntity } from "@gemunion/nest-js-module-typeorm-helpers";

import { UniContractEntity } from "../collection/collection.entity";
import { UniTemplateEntity } from "../template/template.entity";
import { Erc998TokenEntity } from "../token/token.entity";

@Entity({ schema: ns, name: "erc998_dropbox" })
export class Erc998DropboxEntity extends SearchableEntity implements IErc998Dropbox {
  @Column({ type: "varchar" })
  public imageUrl: string;

  @BigNumberColumn()
  public price: string;

  @Column({
    type: "enum",
    enum: DropboxStatus,
  })
  public dropboxStatus: DropboxStatus;

  @Column({ type: "int" })
  public erc998TemplateId: number;

  @JoinColumn()
  @ManyToOne(_type => UniTemplateEntity)
  public erc998Template: UniTemplateEntity;

  @Column({ type: "int" })
  public erc998CollectionId: number;

  @JoinColumn()
  @ManyToOne(_type => UniContractEntity)
  public erc998Collection: UniContractEntity;

  @OneToMany(_type => Erc998TokenEntity, token => token.erc998Dropbox)
  public erc998Tokens: Array<Erc998TokenEntity>;
}
