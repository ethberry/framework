import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { Mixin } from "ts-mixer";

import { DeployableEntity, SearchableEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import type { IContract } from "@framework/types";
import { ContractFeatures, ContractSecurity, ContractStatus, ModuleType, TokenType } from "@framework/types";
import { ns } from "@framework/constants";

import { TemplateEntity } from "../template/template.entity";
import { CompositionEntity } from "../../tokens/erc998/composition/composition.entity";
import { EventHistoryEntity } from "../../event-history/event-history.entity";
import { MerchantEntity } from "../../../infrastructure/merchant/merchant.entity";

@Entity({ schema: ns, name: "contract" })
export class ContractEntity extends Mixin(DeployableEntity, SearchableEntity) implements IContract {
  @Column({ type: "int" })
  public merchantId: number;

  @JoinColumn()
  @OneToOne(_type => MerchantEntity)
  public merchant: MerchantEntity;

  @Column({ type: "varchar" })
  public imageUrl: string;

  @Column({ type: "varchar" })
  public name: string;

  @Column({ type: "varchar" })
  public symbol: string;

  @Column({ type: "int" })
  public decimals: number;

  @Column({ type: "int" })
  public fromBlock: number;

  @Column({ type: "int" })
  public royalty: number;

  @Column({ type: "varchar" })
  public baseTokenURI: string;

  @Column({ type: "json" })
  public parameters: Record<string, string | number>;

  @Column({ type: "boolean" })
  public isPaused: boolean;

  @Column({
    type: "enum",
    enum: ContractStatus,
    default: ContractStatus.NEW,
  })
  public contractStatus: ContractStatus;

  @Column({
    type: "enum",
    enum: TokenType,
    nullable: true,
  })
  public contractType: TokenType | null;

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

  @Column({
    type: "enum",
    enum: ContractSecurity,
  })
  public contractSecurity: ContractSecurity;

  @OneToMany(_type => TemplateEntity, template => template.contract)
  public templates: Array<TemplateEntity>;

  @OneToMany(_type => EventHistoryEntity, history => history.contractId)
  public history: Array<EventHistoryEntity>;

  @OneToMany(_type => CompositionEntity, composition => composition.child)
  public parent: Array<CompositionEntity>;

  @OneToMany(_type => CompositionEntity, composition => composition.parent)
  public children: Array<CompositionEntity>;
}
