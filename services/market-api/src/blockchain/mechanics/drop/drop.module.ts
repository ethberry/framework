import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { SignerModule } from "@gemunion/nest-js-module-exchange-signer";

import { DropEntity } from "./drop.entity";
import { DropService } from "./drop.service";
import { DropController } from "./drop.controller";
import { TemplateModule } from "../../hierarchy/template/template.module";

@Module({
  imports: [SignerModule, TemplateModule, TypeOrmModule.forFeature([DropEntity])],
  providers: [DropService],
  controllers: [DropController],
  exports: [DropService],
})
export class DropModule {}
