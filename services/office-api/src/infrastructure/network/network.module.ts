import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { NetworkService } from "./network.service";
import { NetworkEntity } from "./network.entity";

import { NetworkController } from "./network.controller";

@Module({
  imports: [TypeOrmModule.forFeature([NetworkEntity])],
  providers: [NetworkService],
  controllers: [NetworkController],
  exports: [NetworkService],
})
export class NetworkModule {}
