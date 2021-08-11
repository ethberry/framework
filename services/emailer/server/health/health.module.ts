import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";
import { ConfigModule } from "@nestjs/config";

import { HealthController } from "./health.controller";
import { EmailHealthIndicator } from "./health.indicator";

@Module({
  imports: [TerminusModule, ConfigModule],
  controllers: [HealthController],
  providers: [EmailHealthIndicator],
})
export class HealthModule {}
