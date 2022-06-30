import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UniTemplateEntity } from "./uni-template.entity";
import { UniTemplateService } from "./uni-template.service";
import { UniTemplateController } from "./uni-template.controller";

@Module({
  imports: [TypeOrmModule.forFeature([UniTemplateEntity])],
  providers: [UniTemplateService],
  controllers: [UniTemplateController],
  exports: [UniTemplateService],
})
export class UniTemplateModule {}
