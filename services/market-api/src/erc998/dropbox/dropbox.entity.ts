import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

import { ns } from "@framework/constants";
import { Erc998DropboxStatus, IErc998Dropbox } from "@framework/types";
import { BigNumberColumn, SearchableEntity } from "@gemunion/nest-js-module-typeorm-helpers";

import { Erc998CollectionEntity } from "../collection/collection.entity";
import { Erc998TemplateEntity } from "../template/template.entity";
import { Erc998TokenEntity } from "../token/token.entity";
import { Erc20TokenEntity } from "../../erc20/token/token.entity";

@Entity({ schema: ns, name: "erc998_dropbox" })
export class Erc998DropboxEntity extends SearchableEntity implements IErc998Dropbox {
  @Column({ type: "varchar" })
  public imageUrl: string;

  @BigNumberColumn()
  public price: string;

  @Column({
    type: "enum",
    enum: Erc998DropboxStatus,
  })
  public dropboxStatus: Erc998DropboxStatus;

  @Column({ type: "int" })
  public erc20TokenId: number;

  @JoinColumn()
  @ManyToOne(_type => Erc20TokenEntity)
  public erc20Token: Erc20TokenEntity;

  @Column({ type: "int" })
  public erc998CollectionId: number;

  @JoinColumn()
  @ManyToOne(_type => Erc998CollectionEntity)
  public erc998Collection: Erc998CollectionEntity;

  @Column({ type: "int" })
  public erc998TemplateId: number;

  @JoinColumn()
  @ManyToOne(_type => Erc998TemplateEntity)
  public erc998Template: Erc998TemplateEntity;

  @OneToMany(_type => Erc998TokenEntity, token => token.erc998Dropbox)
  public erc998Tokens: Array<Erc998TokenEntity>;
}
