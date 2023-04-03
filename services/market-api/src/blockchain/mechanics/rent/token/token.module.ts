import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { MysteryTokenService } from "./token.service";
import { MysteryTokenController } from "./token.controller";
import { TokenEntity } from "../../../hierarchy/token/token.entity";

@Module({
  imports: [TypeOrmModule.forFeature([TokenEntity])],
  providers: [MysteryTokenService],
  controllers: [MysteryTokenController],
  exports: [MysteryTokenService],
})
export class RentTokenModule {}
