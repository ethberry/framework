import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc998TemplateService } from "./template.service";
import { UniTemplateEntity } from "../../blockchain/uni-token/uni-template.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UniTemplateEntity])],
  providers: [Erc998TemplateService],
  exports: [Erc998TemplateService],
})
export class Erc998TemplateModule {}
