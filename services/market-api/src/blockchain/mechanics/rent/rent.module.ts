import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SignerModule } from "@framework/nest-js-module-exchange-signer";

import { SettingsModule } from "../../../infrastructure/settings/settings.module";
import { TemplateModule } from "../../hierarchy/template/template.module";
import { ContractModule } from "../../hierarchy/contract/contract.module";
import { TokenEntity } from "../../hierarchy/token/token.entity";
import { TokenModule } from "../../hierarchy/token/token.module";
import { RentEntity } from "./rent.entity";
import { RentService } from "./rent.service";
import { RentSignService } from "./rent.sign.service";
import { RentController } from "./rent.controller";
import { RentTokenService } from "./rent.token.service";

@Module({
  imports: [
    SettingsModule,
    SignerModule,
    TypeOrmModule.forFeature([TokenEntity, RentEntity]),
    ContractModule,
    TemplateModule,
    TokenModule,
  ],
  controllers: [RentController],
  providers: [RentService, RentSignService, RentTokenService],
  exports: [RentService, RentSignService, RentTokenService],
})
export class RentModule {}
