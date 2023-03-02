import { forwardRef, Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { UserEntity } from "./user.entity";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [ConfigModule, forwardRef(() => AuthModule), TypeOrmModule.forFeature([UserEntity])],
  providers: [Logger, UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
