import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";

import { ns } from "@framework/constants";
import { DropboxStatus, IDropbox } from "@framework/types";
import { SearchableEntity } from "@gemunion/nest-js-module-typeorm-helpers";

import { ContractEntity } from "../../blockchain/uni-token/uni-contract/uni-contract.entity";
import { TokenEntity } from "../../blockchain/uni-token/uni-token/uni-token.entity";
import { AssetEntity } from "../../blockchain/asset/asset.entity";
import { TemplateEntity } from "../../blockchain/uni-token/uni-template/uni-template.entity";

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
  public templateId: number;

  @JoinColumn()
  @ManyToOne(_type => TemplateEntity)
  public template: TemplateEntity;

  @Column({ type: "int" })
  public contractId: number;

  @JoinColumn()
  @ManyToOne(_type => ContractEntity)
  public contract: ContractEntity;

  @OneToOne(_type => TokenEntity)
  public token: TokenEntity;
}
