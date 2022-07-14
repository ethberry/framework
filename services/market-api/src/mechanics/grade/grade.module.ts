import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ethersRpcProvider, ethersSignerProvider } from "@gemunion/nestjs-ethers";

import { GradeService } from "./grade.service";
import { GradeController } from "./grade.controller";
import { TokenModule } from "../../blockchain/hierarchy/token/token.module";

@Module({
  imports: [ConfigModule, TokenModule],
  providers: [ethersRpcProvider, ethersSignerProvider, Logger, GradeService],
  controllers: [GradeController],
  exports: [GradeService],
})
export class GradeModule {}
