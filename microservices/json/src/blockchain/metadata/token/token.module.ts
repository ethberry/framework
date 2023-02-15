import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import { MetadataTokenService } from "./token.service";
import { MetadataTokenController } from "./token.controller";
import { TokenEntity } from "../../hierarchy/token/token.entity";

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([TokenEntity])],
  providers: [MetadataTokenService],
  controllers: [MetadataTokenController],
  exports: [MetadataTokenService],
})
export class MetadataTokenModule {}
