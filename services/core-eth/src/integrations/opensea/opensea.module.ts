import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";

import { OpenSeaService } from "./opensea.service";

@Module({
  imports: [HttpModule],
  providers: [OpenSeaService],
  exports: [OpenSeaService],
})
export class OpenSeaModule {}
