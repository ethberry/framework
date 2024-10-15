import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { PayeesEntity } from "./payees.entity";
import { PayeesService } from "./payees.service";

@Module({
  imports: [TypeOrmModule.forFeature([PayeesEntity])],
  providers: [Logger, PayeesService],
  exports: [PayeesService],
})
export class PayeeModule {}
