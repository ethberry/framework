import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc721TemplateEntity } from "./template.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Erc721TemplateEntity])],
})
export class Erc721TemplateModule {}
