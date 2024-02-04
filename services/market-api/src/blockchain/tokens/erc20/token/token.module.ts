import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc20TokenService } from "./token.service";
import { Erc20TokenController } from "./token.controller";
import { TokenEntity } from "../../../hierarchy/token/token.entity";

@Module({
  imports: [TypeOrmModule.forFeature([TokenEntity])],
  providers: [Erc20TokenService],
  controllers: [Erc20TokenController],
  exports: [Erc20TokenService],
})
export class Erc20TokenModule {}
