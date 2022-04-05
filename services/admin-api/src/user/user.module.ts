import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { UserEntity } from "./user.entity";
import { OtpModule } from "../otp/otp.module";
import { emlServiceProvider } from "../common/providers";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), ConfigModule, OtpModule],
  providers: [Logger, UserService, emlServiceProvider],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
