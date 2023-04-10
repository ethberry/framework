import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SignerModule } from "@gemunion/nest-js-module-exchange-signer";

import { RentEntity } from "./rent.entity";
import { RentService } from "./rent.service";
import { RentSignService } from "./rent.sign.service";
import { RentController } from "./rent.controller";
import { TemplateModule } from "../../hierarchy/template/template.module";
import { RentTokenService } from "./rent.token.service";
import { TokenEntity } from "../../hierarchy/token/token.entity";
import { TokenModule } from "../../hierarchy/token/token.module";

@Module({
  imports: [
    SignerModule,
    TypeOrmModule.forFeature([TokenEntity]),
    TypeOrmModule.forFeature([RentEntity]),
    TemplateModule,
    TokenModule,
  ],
  controllers: [RentController],
  providers: [RentService, RentSignService, RentTokenService],
  exports: [RentService, RentSignService, RentTokenService],
})
export class RentModule {}
