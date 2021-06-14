import {Logger, Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigModule} from "@nestjs/config";

import {UserService} from "./user.service";
import {UserEntity} from "./user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), ConfigModule],
  providers: [Logger, UserService],
  exports: [UserService],
})
export class UserModule {}
