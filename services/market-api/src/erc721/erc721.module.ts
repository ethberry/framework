import { Module } from "@nestjs/common";

import { Erc721ContractModule } from "./contract/contract.module";
import { Erc721TemplateModule } from "./template/template.module";
import { Erc721TokenModule } from "./token/token.module";
import { Erc721GradeModule } from "../mechanics/grade/grade.module";

@Module({
  imports: [Erc721ContractModule, Erc721TemplateModule, Erc721TokenModule, Erc721GradeModule],
})
export class Erc721Module {}
