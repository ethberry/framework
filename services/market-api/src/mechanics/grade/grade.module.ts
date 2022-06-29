import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ethersRpcProvider, ethersSignerProvider } from "@gemunion/nestjs-ethers";

import { Erc721GradeService } from "./grade.service";
import { Erc721GradeController } from "./grade.controller";
import { Erc721TokenModule } from "../../erc721/token/token.module";

@Module({
  imports: [ConfigModule, Erc721TokenModule],
  providers: [ethersRpcProvider, ethersSignerProvider, Logger, Erc721GradeService],
  controllers: [Erc721GradeController],
  exports: [Erc721GradeService],
})
export class Erc721GradeModule {}
