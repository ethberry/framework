import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc20TokenService } from "./token.service";
import { Erc20TokenEntity } from "./token.entity";
import { Erc20TokenController } from "./token.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Erc20TokenEntity])],
  providers: [Erc20TokenService],
  controllers: [Erc20TokenController],
  exports: [Erc20TokenService],
})
export class Erc20TokenModule {}
