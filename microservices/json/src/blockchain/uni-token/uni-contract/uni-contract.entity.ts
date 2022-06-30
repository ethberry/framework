import { Column, Entity, OneToMany } from "typeorm";
import { Mixin } from "ts-mixer";

import { ContractBaseEntity, SearchableEntity } from "@gemunion/nest-js-module-typeorm-helpers";
import { IUniContract, TokenType, UniContractRole, UniContractStatus, UniContractTemplate } from "@framework/types";
import { ns } from "@framework/constants";
import { UniTemplateEntity } from "../uni-template/uni-template.entity";

@Entity({ schema: ns, name: "uni_contract" })
export class UniContractEntity extends Mixin(ContractBaseEntity, SearchableEntity) implements IUniContract {
  @Column({ type: "varchar" })
  public imageUrl: string;

  @Column({ type: "varchar" })
  public name: string;

  @Column({ type: "varchar" })
  public symbol: string;

  @Column({ type: "int" })
  public royalty: number;

  @Column({ type: "varchar" })
  public baseTokenURI: string;

  @Column({
    type: "enum",
    enum: UniContractStatus,
  })
  public contractStatus: UniContractStatus;

  @Column({
    type: "enum",
    enum: TokenType,
  })
  public contractType: TokenType;

  @Column({
    type: "enum",
    enum: UniContractRole,
  })
  public contractRole: UniContractRole;

  @Column({
    type: "enum",
    enum: UniContractTemplate,
  })
  public contractTemplate: UniContractTemplate;

  @OneToMany(_type => UniTemplateEntity, template => template.uniContract)
  public uniTemplates: Array<UniTemplateEntity>;
}
