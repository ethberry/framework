import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc998TemplateService } from "./template.service";
import { Erc998TemplateEntity } from "./template.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Erc998TemplateEntity])],
  providers: [Erc998TemplateService],
  exports: [Erc998TemplateService],
})
export class Erc998TemplateModule {}
