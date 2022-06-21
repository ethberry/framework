import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ethersRpcProvider, ethersSignerProvider } from "@gemunion/nestjs-ethers";

import { Erc998GradeService } from "./grade.service";
import { Erc998GradeController } from "./grade.controller";
import { Erc998TokenModule } from "../token/token.module";

@Module({
  imports: [ConfigModule, Erc998TokenModule],
  providers: [ethersRpcProvider, ethersSignerProvider, Logger, Erc998GradeService],
  controllers: [Erc998GradeController],
  exports: [Erc998GradeService],
})
export class Erc998GradeModule {}
