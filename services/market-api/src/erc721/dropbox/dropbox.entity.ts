import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

import { ns } from "@framework/constants";
import { Erc721DropboxStatus, IErc721Dropbox } from "@framework/types";
import { BigNumberColumn, SearchableEntity } from "@gemunion/nest-js-module-typeorm-helpers";

import { Erc721CollectionEntity } from "../collection/collection.entity";
import { Erc721TemplateEntity } from "../template/template.entity";
import { Erc721TokenEntity } from "../token/token.entity";

@Entity({ schema: ns, name: "erc721_dropbox" })
export class Erc721DropboxEntity extends SearchableEntity implements IErc721Dropbox {
  @Column({ type: "varchar" })
  public imageUrl: string;

  @BigNumberColumn()
  public price: string;

  @Column({
    type: "enum",
    enum: Erc721DropboxStatus,
  })
  public dropboxStatus: Erc721DropboxStatus;

  @Column({ type: "int" })
  public erc721CollectionId: number;

  @JoinColumn()
  @ManyToOne(_type => Erc721CollectionEntity)
  public erc721Collection: Erc721CollectionEntity;

  @Column({ type: "int" })
  public erc721TemplateId: number;

  @JoinColumn()
  @ManyToOne(_type => Erc721TemplateEntity)
  public erc721Template: Erc721TemplateEntity;

  @OneToMany(_type => Erc721TokenEntity, token => token.erc721Dropbox)
  public erc721Tokens: Array<Erc721TokenEntity>;
}
