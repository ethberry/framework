import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";

import { ns } from "@framework/constants";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";

import { IOwnership } from "@framework/types/dist/entities/blockchain/hierarchy/ownership";

import { TokenEntity } from "../../../hierarchy/token/token.entity";

@Entity({ schema: ns, name: "ownership" })
export class OwnershipEntity extends IdDateBaseEntity implements IOwnership {
  @Column({ type: "int" })
  public parentId: number;

  @JoinColumn()
  @ManyToOne(_type => TokenEntity)
  public parent: TokenEntity;

  @Column({ type: "int" })
  public childId: number;

  @JoinColumn()
  @OneToOne(_type => TokenEntity)
  public child: TokenEntity;

  @Column({ type: "int" })
  public amount: number;
}
