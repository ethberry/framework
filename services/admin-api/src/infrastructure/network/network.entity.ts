import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

import { INetwork } from "@ethberry/types-blockchain";
import { ns } from "@framework/constants";

@Entity({ schema: ns, name: "network" })
export class NetworkEntity extends BaseEntity implements INetwork {
  @PrimaryColumn({ type: "int" })
  public chainId: number;

  @Column({ type: "varchar" })
  public chainName: any;

  @Column({ type: "int" })
  public order: number | undefined;

  @Column({ type: "json" })
  public rpcUrls: any;

  @Column({ type: "json" })
  public blockExplorerUrls: any;

  @Column({ type: "json" })
  public nativeCurrency: any;
}
