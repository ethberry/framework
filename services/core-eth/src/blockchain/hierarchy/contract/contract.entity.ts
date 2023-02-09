import { Column, Entity, OneToMany } from "typeorm";
import { Mixin } from "ts-mixer";

import { DeployableEntity, SearchableEntity, JsonColumn } from "@gemunion/nest-js-module-typeorm-postgres";
import type { IContract } from "@framework/types";
import { ContractFeatures, ContractStatus, ModuleType, TokenType } from "@framework/types";
import { ns } from "@framework/constants";
import { TemplateEntity } from "../template/template.entity";
import { CompositionEntity } from "../../tokens/erc998/composition/composition.entity";
import { ContractHistoryEntity } from "../../contract-history/contract-history.entity";

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

  @Column({ type: "int" })
  public fromBlock: number;

  @Column({ type: "varchar" })
  public baseTokenURI: string;

  @JsonColumn()
  public parameters: any;

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

  @OneToMany(_type => ContractHistoryEntity, history => history.contractId)
  public history: Array<ContractHistoryEntity>;

  @OneToMany(_type => CompositionEntity, composition => composition.child)
  public parent: Array<CompositionEntity>;

  @OneToMany(_type => CompositionEntity, composition => composition.parent)
  public children: Array<CompositionEntity>;
}
