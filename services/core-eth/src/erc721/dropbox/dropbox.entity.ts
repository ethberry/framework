import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

import { ns } from "@framework/constants";
import { Erc721DropboxStatus, IErc721Dropbox } from "@framework/types";
import { BigNumberColumn, SearchableEntity } from "@gemunion/nest-js-module-typeorm-helpers";

import { UniContractEntity } from "../collection/collection.entity";
import { UniTemplateEntity } from "../template/template.entity";
import { UniTokenEntity } from "../token/token.entity";

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
  public erc721TemplateId: number;

  @JoinColumn()
  @ManyToOne(_type => UniTemplateEntity)
  public erc721Template: UniTemplateEntity;

  @Column({ type: "int" })
  public erc721CollectionId: number;

  @JoinColumn()
  @ManyToOne(_type => UniContractEntity)
  public erc721Collection: UniContractEntity;

  @OneToMany(_type => UniTokenEntity, token => token.erc721Dropbox)
  public erc721Tokens: Array<UniTokenEntity>;
}
