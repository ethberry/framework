import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne } from "typeorm";

import { ns } from "@framework/constants";
import { ICustomParameter, ParameterType } from "@framework/types";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";

import { ProductItemEntity } from "../product-item/product-item.entity";
import { UserEntity } from "../../infrastructure/user/user.entity";

@Entity({ schema: ns, name: "custom_parameter" })
export class CustomParameterEntity extends IdDateBaseEntity implements ICustomParameter {
  @Column({ type: "varchar" })
  public parameterName: string;

  @Column({ type: "varchar" })
  public parameterType: ParameterType;

  @Column({ type: "varchar", nullable: true })
  public parameterValue: string | null;

  @ManyToMany(_type => ProductItemEntity, productItem => productItem.parameters)
  @JoinTable({ name: "product_item_parameter" })
  public productItems: Array<ProductItemEntity>;

  @JoinColumn()
  @OneToOne(_type => UserEntity)
  public user: UserEntity;

  @Column({ type: "int" })
  public userId: number;

  @Column({ type: "int" })
  public productItemId: number;
}
