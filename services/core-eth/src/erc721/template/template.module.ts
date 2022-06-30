import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc721TemplateService } from "./template.service";
import { UniTemplateEntity } from "../../blockchain/uni-token/uni-template/uni-template.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UniTemplateEntity])],
  providers: [Erc721TemplateService],
  exports: [Erc721TemplateService],
})
export class Erc721TemplateModule {}
