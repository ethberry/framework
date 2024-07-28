import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { signalServiceProvider } from "../../../../common/providers";
import { EventHistoryModule } from "../../../event-history/event-history.module";
import { TokenModule } from "../../../hierarchy/token/token.module";
import { TemplateModule } from "../../../hierarchy/template/template.module";
import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { DiscreteEntity } from "./discrete.entity";
import { DiscreteService } from "./discrete.service";
import { DiscreteTokenLogModule } from "./log/log.module";
import { DiscreteControllerEth } from "./discrete.controller.eth";
import { DiscreteServiceEth } from "./discrete.service.eth";

@Module({
  imports: [
    TokenModule,
    TemplateModule,
    ConfigModule,
    ContractModule,
    DiscreteTokenLogModule,
    EventHistoryModule,
    TypeOrmModule.forFeature([DiscreteEntity]),
  ],
  providers: [signalServiceProvider, Logger, DiscreteService, DiscreteServiceEth],
  controllers: [DiscreteControllerEth],
  exports: [DiscreteService, DiscreteServiceEth],
})
export class DiscreteModule {}
