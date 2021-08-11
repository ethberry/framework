import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import { emailServiceProvider } from "../common/providers";
import { TokenService } from "../token/token.service";
import { TokenEntity } from "../token/token.entity";
import { EmailService } from "./email.service";
import { EmailController } from "./email.controller";

@Module({
  imports: [TypeOrmModule.forFeature([TokenEntity]), ConfigModule],
  providers: [emailServiceProvider, EmailService, TokenService],
  controllers: [EmailController],
  exports: [EmailService],
})
export class EmailModule {}
