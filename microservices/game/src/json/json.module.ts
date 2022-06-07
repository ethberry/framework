import { HttpModule } from "@nestjs/axios";
import { ConfigModule } from "@nestjs/config";
import { Logger, Module } from "@nestjs/common";

import { JsonService } from "./json.service";
import { JsonController } from "./json.controller";

@Module({
  imports: [ConfigModule, HttpModule],
  providers: [Logger, JsonService],
  controllers: [JsonController],
  exports: [JsonService],
})
export class JsonModule {}
