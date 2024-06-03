import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { RaffleTicketTokenService } from "./token.service";
import { RaffleTicketTokenController } from "./token.controller";
import { TokenEntity } from "../../../../../hierarchy/token/token.entity";

@Module({
  imports: [TypeOrmModule.forFeature([TokenEntity])],
  providers: [RaffleTicketTokenService],
  controllers: [RaffleTicketTokenController],
  exports: [RaffleTicketTokenService],
})
export class RaffleTicketTokenModule {}
