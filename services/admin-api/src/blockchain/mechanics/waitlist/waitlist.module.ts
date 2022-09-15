import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { WaitlistEntity } from "./waitlist.entity";
import { WaitlistService } from "./waitlist.service";
import { WaitlistController } from "./waitlist.controller";

@Module({
  imports: [TypeOrmModule.forFeature([WaitlistEntity])],
  providers: [WaitlistService],
  controllers: [WaitlistController],
  exports: [WaitlistService],
})
export class WaitlistModule {}
