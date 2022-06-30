import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc998TemplateService } from "./template.service";
import { TemplateEntity } from "../../blockchain/uni-token/uni-template/uni-template.entity";

@Module({
  imports: [TypeOrmModule.forFeature([TemplateEntity])],
  providers: [Erc998TemplateService],
  exports: [Erc998TemplateService],
})
export class Erc998TemplateModule {}
