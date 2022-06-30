import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";

import { ns } from "@framework/constants";
import { DropboxStatus, IDropbox } from "@framework/types";
import { SearchableEntity } from "@gemunion/nest-js-module-typeorm-helpers";

import { UniContractEntity } from "../../blockchain/uni-token/uni-contract.entity";
import { UniTokenEntity } from "../../blockchain/uni-token/uni-token.entity";
import { AssetEntity } from "../../blockchain/asset/asset.entity";
import { UniTemplateEntity } from "../../blockchain/uni-token/uni-template.entity";

@Entity({ schema: ns, name: "dropbox" })
export class DropboxEntity extends SearchableEntity implements IDropbox {
  @Column({ type: "varchar" })
  public imageUrl: string;

  @JoinColumn()
  @OneToOne(_type => AssetEntity)
  public price: AssetEntity;

  @JoinColumn()
  @OneToOne(_type => AssetEntity)
  public item: AssetEntity;

  @Column({
    type: "enum",
    enum: DropboxStatus,
  })
  public dropboxStatus: DropboxStatus;

  @Column({ type: "int" })
  public uniTemplateId: number;

  @JoinColumn()
  @ManyToOne(_type => UniTemplateEntity)
  public uniTemplate: UniTemplateEntity;

  @Column({ type: "int" })
  public uniContractId: number;

  @JoinColumn()
  @ManyToOne(_type => UniContractEntity)
  public uniContract: UniContractEntity;

  @OneToOne(_type => UniTokenEntity)
  public token: UniTokenEntity;
}
