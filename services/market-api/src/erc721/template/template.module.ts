import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc721TemplateService } from "./template.service";
import { Erc721TemplateController } from "./template.controller";
import { UniTemplateEntity } from "../../blockchain/uni-token/uni-template/uni-template.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UniTemplateEntity])],
  providers: [Erc721TemplateService],
  controllers: [Erc721TemplateController],
  exports: [Erc721TemplateService],
})
export class Erc721TemplateModule {}
