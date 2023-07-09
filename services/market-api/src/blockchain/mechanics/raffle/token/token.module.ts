import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { RaffleTokenService } from "./token.service";
import { RaffleTokenController } from "./token.controller";
import { TokenEntity } from "../../../hierarchy/token/token.entity";

@Module({
  imports: [TypeOrmModule.forFeature([TokenEntity])],
  providers: [RaffleTokenService],
  controllers: [RaffleTokenController],
  exports: [RaffleTokenService],
})
export class RaffleTokenModule {}
