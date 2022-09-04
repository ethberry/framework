import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { WrapperTokenService } from "./token.service";
import { WrapperTokenController } from "./token.controller";
import { TokenEntity } from "../../../hierarchy/token/token.entity";

@Module({
  imports: [TypeOrmModule.forFeature([TokenEntity])],
  providers: [WrapperTokenService],
  controllers: [WrapperTokenController],
  exports: [WrapperTokenService],
})
export class WrapperTokenModule {}
