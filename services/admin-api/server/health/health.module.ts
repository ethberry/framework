import {Module} from "@nestjs/common";
import {TerminusModule} from "@nestjs/terminus";
import {ConfigModule} from "@nestjs/config";
import {RedisModule} from "@liaoliaots/nestjs-redis";

import {HealthController} from "./health.controller";

@Module({
  imports: [TerminusModule, ConfigModule, RedisModule],
  controllers: [HealthController],
})
export class HealthModule {}
