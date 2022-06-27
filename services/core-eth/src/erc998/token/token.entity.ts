import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";

import { UniTokenStatus, IErc998Token } from "@framework/types";
import { ns } from "@framework/constants";
import { BigNumberColumn, IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";

import { UniTemplateEntity } from "../template/template.entity";
import { Erc998DropboxEntity } from "../dropbox/dropbox.entity";

@Entity({ schema: ns, name: "erc998_token" })
export class Erc998TokenEntity extends IdDateBaseEntity implements IErc998Token {
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
  public erc998TemplateId: number;

  @JoinColumn()
  @ManyToOne(_type => UniTemplateEntity, template => template.erc998Tokens)
  public erc998Template: UniTemplateEntity;

  @Column({ type: "int" })
  public erc998DropboxId: number;

  @JoinColumn()
  @ManyToOne(_type => Erc998DropboxEntity, dropbox => dropbox.erc998Tokens)
  public erc998Dropbox: Erc998DropboxEntity;

  @Column({ type: "int" })
  public erc998TokenId: number;

  @JoinColumn()
  @OneToOne(_type => Erc998TokenEntity, dropbox => dropbox.erc998Token)
  public erc998Token: Erc998TokenEntity;
}
