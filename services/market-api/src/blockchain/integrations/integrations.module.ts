import { Module } from "@nestjs/common";

import { PinataModule } from "./pinata/pinata.module";

@Module({
  imports: [PinataModule],
})
export class IntegrationsModule {}
