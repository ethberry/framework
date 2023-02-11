import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { BreedServiceEth } from "./breed.service.eth";
import { BreedService } from "./breed.service";
import { BreedEntity } from "./breed.entity";
// import { TokenModule } from "../../hierarchy/token/token.module";
// import { ContractModule } from "../../hierarchy/contract/contract.module";
import { EventHistoryModule } from "../../event-history/event-history.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([BreedEntity]),
    EventHistoryModule,
    // ContractModule,
    // forwardRef(() => TokenModule),
    ConfigModule,
  ],
  providers: [Logger, BreedService, BreedServiceEth],
  exports: [BreedService, BreedServiceEth],
})
export class BreedModule {}
