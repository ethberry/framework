import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import { MetadataTokenService } from "./token.service";
import { MetadataTokenController } from "./token.controller";
import { UniTokenEntity } from "../../uni-token/uni-token.entity";

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([UniTokenEntity])],
  providers: [MetadataTokenService],
  controllers: [MetadataTokenController],
  exports: [MetadataTokenService],
})
export class Erc1155TokenModule {}
