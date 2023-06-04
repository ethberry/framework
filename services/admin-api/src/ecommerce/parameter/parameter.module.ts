import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ParameterService } from "./parameter.service";
import { ParameterEntity } from "./parameter.entity";
import { ParameterController } from "./parameter.controller";

@Module({
  imports: [TypeOrmModule.forFeature([ParameterEntity])],
  providers: [ParameterService],
  controllers: [ParameterController],
  exports: [ParameterService],
})
export class ParameterModule {}
