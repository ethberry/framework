import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";

import { UniTokenStatus, IErc721Token } from "@framework/types";
import { ns } from "@framework/constants";
import { BigNumberColumn, IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";

import { UniTemplateEntity } from "../template/template.entity";
import { Erc721DropboxEntity } from "../dropbox/dropbox.entity";

@Entity({ schema: ns, name: "erc721_token" })
export class UniTokenEntity extends IdDateBaseEntity implements IErc721Token {
  @Column({ type: "json" })
  public attributes: any;

  @Column({
    type: "enum",
    enum: UniTokenStatus,
  })
  public tokenStatus: UniTokenStatus;

  @BigNumberColumn()
  public tokenId: string;

  @Column({ type: "varchar" })
  public owner: string;

  @Column({ type: "int" })
  public erc721TemplateId: number;

  @JoinColumn()
  @ManyToOne(_type => UniTemplateEntity, template => template.erc721Tokens)
  public erc721Template: UniTemplateEntity;

  @Column({ type: "int" })
  public erc721DropboxId: number;

  @JoinColumn()
  @ManyToOne(_type => Erc721DropboxEntity, dropbox => dropbox.erc721Tokens)
  public erc721Dropbox: Erc721DropboxEntity;

  @Column({ type: "int" })
  public erc721TokenId: number;

  @JoinColumn()
  @OneToOne(_type => UniTokenEntity, dropbox => dropbox.erc721Token)
  public erc721Token: UniTokenEntity;
}
