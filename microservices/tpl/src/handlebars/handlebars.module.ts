import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { pdfServiceProvider } from "../common/provider";
import { HandlebarsController } from "./handlebars.controller";
import { HandlebarsService } from "./handlebars.service";

@Module({
  imports: [ConfigModule],
  controllers: [HandlebarsController],
  providers: [pdfServiceProvider, Logger, HandlebarsService],
})
export class HandlebarsModule {}
