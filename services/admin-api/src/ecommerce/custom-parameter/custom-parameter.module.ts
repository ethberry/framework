import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CustomParameterService } from "./custom-parameter.service";
import { CustomParameterEntity } from "./custom-parameter.entity";
import { CustomParameterController } from "./custom-parameter.controller";

@Module({
  imports: [TypeOrmModule.forFeature([CustomParameterEntity])],
  providers: [CustomParameterService],
  controllers: [CustomParameterController],
  exports: [CustomParameterService],
})
export class CustomParameterModule {}
