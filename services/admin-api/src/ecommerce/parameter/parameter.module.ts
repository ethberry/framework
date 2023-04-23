import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ParameterService } from "./parameter.service";
import { ParameterEntity } from "./parameter.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ParameterEntity])],
  providers: [ParameterService],
  exports: [ParameterService],
})
export class ParameterModule {}
