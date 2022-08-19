import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { MysteryboxTokenService } from "./token.service";
import { MysteryboxTokenController } from "./token.controller";
import { TokenEntity } from "../../../hierarchy/token/token.entity";

@Module({
  imports: [TypeOrmModule.forFeature([TokenEntity])],
  providers: [MysteryboxTokenService],
  controllers: [MysteryboxTokenController],
  exports: [MysteryboxTokenService],
})
export class MysteryboxTokenModule {}
