import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { TwoFAService } from "./2fa.service";
import { TwoFAEntity } from "./2fa.entity";
import { TwoFAController } from "./2fa.controller";
import { UserModule } from "../user/user.module";

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([TwoFAEntity])],
  providers: [TwoFAService],
  controllers: [TwoFAController],
  exports: [TwoFAService],
})
export class TwoFAModule {}
