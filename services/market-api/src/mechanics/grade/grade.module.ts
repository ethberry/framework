import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ethersRpcProvider, ethersSignerProvider } from "@gemunion/nestjs-ethers";

import { GradeService } from "./grade.service";
import { GradeController } from "./grade.controller";
import { TokenModule } from "../../blockchain/hierarchy/token/token.module";
import { GradeEntity } from "./grade.entity";

@Module({
  imports: [ConfigModule, TokenModule, TypeOrmModule.forFeature([GradeEntity])],
  providers: [ethersRpcProvider, ethersSignerProvider, Logger, GradeService],
  controllers: [GradeController],
  exports: [GradeService],
})
export class GradeModule {}
