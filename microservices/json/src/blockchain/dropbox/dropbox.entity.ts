import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";

import { ns } from "@framework/constants";
import { SearchableEntity } from "@gemunion/nest-js-module-typeorm-helpers";
import { DropboxStatus, IDropbox } from "@framework/types";
import { AssetEntity } from "../asset/asset";
import { UniContractEntity } from "../../uni-token/uni-contract.entity";

@Entity({ schema: ns, name: "erc721_dropbox" })
export class DropboxEntity extends SearchableEntity implements IDropbox {
  @Column({ type: "varchar" })
  public imageUrl: string;

  @Column({ type: "int" })
  public priceId: number;

  @JoinColumn()
  @OneToOne(_type => AssetEntity)
  public price: AssetEntity;

  @Column({ type: "int" })
  public itemId: number;

  @JoinColumn()
  @OneToOne(_type => AssetEntity)
  public item: AssetEntity;

  @Column({
    type: "enum",
    enum: DropboxStatus,
  })
  public dropboxStatus: DropboxStatus;

  @Column({ type: "int" })
  public uniContractId: number;

  @JoinColumn()
  @ManyToOne(_type => UniContractEntity)
  public uniContract: UniContractEntity;
}
