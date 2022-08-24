import { Column, Entity, OneToMany } from "typeorm";
import { Mixin } from "ts-mixer";

import { DeployableEntity, SearchableEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import type { IContract } from "@framework/types";
import { ContractFeatures, ContractStatus, ModuleType, TokenType } from "@framework/types";
import { ns } from "@framework/constants";

import { TemplateEntity } from "../template/template.entity";

@Entity({ schema: ns, name: "contract" })
export class ContractEntity extends Mixin(DeployableEntity, SearchableEntity) implements IContract {
  @Column({ type: "varchar" })
  public imageUrl: string;

  @Column({ type: "varchar" })
  public name: string;

  @Column({ type: "varchar" })
  public symbol: string;

  @Column({ type: "int" })
  public decimals: number;

  @Column({ type: "int" })
  public royalty: number;

  @Column({ type: "varchar" })
  public baseTokenURI: string;

  @Column({ type: "boolean" })
  public isPaused: boolean;

  @Column({
    type: "enum",
    enum: ContractStatus,
  })
  public contractStatus: ContractStatus;

  @Column({
    type: "enum",
    enum: TokenType,
  })
  public contractType: TokenType;

  @Column({
    type: "enum",
    enum: ContractFeatures,
    array: true,
  })
  public contractFeatures: Array<ContractFeatures>;

  @Column({
    type: "enum",
    enum: ModuleType,
  })
  public contractModule: ModuleType;

  @OneToMany(_type => TemplateEntity, template => template.contract)
  public templates: Array<TemplateEntity>;
}
