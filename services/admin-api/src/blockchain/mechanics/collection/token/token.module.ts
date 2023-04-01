import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CollectionTokenService } from "./token.service";
import { CollectionTokenController } from "./token.controller";
import { TokenEntity } from "../../../hierarchy/token/token.entity";

@Module({
  imports: [TypeOrmModule.forFeature([TokenEntity])],
  providers: [Logger, CollectionTokenService],
  controllers: [CollectionTokenController],
  exports: [CollectionTokenService],
})
export class CollectionTokenModule {}
