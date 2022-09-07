import { Module } from "@nestjs/common";

import { Erc721ContractModule } from "./contract/contract.module";
import { Erc721TemplateModule } from "./template/template.module";
import { Erc721TokenModule } from "./token/token.module";
import { GradeModule } from "../../mechanics/grade/grade.module";

@Module({
  imports: [Erc721ContractModule, Erc721TemplateModule, Erc721TokenModule, GradeModule],
})
export class Erc721Module {}
