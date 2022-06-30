import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc721TokenService } from "./token.service";
import { Erc721TokenController } from "./token.controller";
import { UniTokenEntity } from "../../blockchain/uni-token/uni-token/uni-token.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UniTokenEntity])],
  providers: [Erc721TokenService],
  controllers: [Erc721TokenController],
  exports: [Erc721TokenService],
})
export class Erc721TokenModule {}
