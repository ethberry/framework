import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc998TemplateEntity } from "./template.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Erc998TemplateEntity])],
})
export class Erc998TemplateModule {}
