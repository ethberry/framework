import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc721TokenService } from "./token.service";
import { Erc721TokenEntity } from "./token.entity";
import { Erc721TokenController } from "./token.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Erc721TokenEntity])],
  providers: [Erc721TokenService],
  controllers: [Erc721TokenController],
  exports: [Erc721TokenService],
})
export class Erc721TokenModule {}
