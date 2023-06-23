import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { RaffleTokentService } from "./token.service";
import { RaffleTokenController } from "./token.controller";
import { TokenEntity } from "../../../hierarchy/token/token.entity";

@Module({
  imports: [TypeOrmModule.forFeature([TokenEntity])],
  providers: [RaffleTokentService],
  controllers: [RaffleTokenController],
  exports: [RaffleTokentService],
})
export class RaffleTokenModule {}
