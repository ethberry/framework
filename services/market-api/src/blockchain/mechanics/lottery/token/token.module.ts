import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { TokenEntity } from "../../../hierarchy/token/token.entity";
import { LotteryTokenService } from "./token.service";
import { LotteryTokenController } from "./token.controller";

@Module({
  imports: [TypeOrmModule.forFeature([TokenEntity])],
  providers: [LotteryTokenService],
  controllers: [LotteryTokenController],
  exports: [LotteryTokenService],
})
export class LotteryTokenModule {}
