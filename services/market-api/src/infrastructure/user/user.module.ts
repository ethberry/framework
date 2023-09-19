import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { UserEntity } from "./user.entity";

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([UserEntity])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
