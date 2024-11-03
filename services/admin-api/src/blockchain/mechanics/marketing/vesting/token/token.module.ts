import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { TokenEntity } from "../../../../hierarchy/token/token.entity";
import { VestingTokenService } from "./token.service";
import { VestingTokenController } from "./token.controller";

@Module({
  imports: [TypeOrmModule.forFeature([TokenEntity])],
  providers: [VestingTokenService],
  controllers: [VestingTokenController],
  exports: [VestingTokenService],
})
export class VestingTokenModule {}
