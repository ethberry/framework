import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc998TokenService } from "./token.service";
import { Erc998TokenController } from "./token.controller";
import { UniTokenEntity } from "../../blockchain/uni-token/uni-token.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UniTokenEntity])],
  providers: [Erc998TokenService],
  controllers: [Erc998TokenController],
  exports: [Erc998TokenService],
})
export class Erc998TokenModule {}
