import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { PayeesEntity } from "./payees.entity";
import { PayeesService } from "./payees.service";
import { PayeesController } from "./payees.controller";

@Module({
  imports: [TypeOrmModule.forFeature([PayeesEntity])],
  providers: [PayeesService],
  controllers: [PayeesController],
  exports: [PayeesService],
})
export class PayeesModule {}
