import { Module } from "@nestjs/common";

import { PinataModule } from "./pinata/pinata.module";
import { InfuraModule } from "./infura/infura.module";

@Module({
  imports: [PinataModule, InfuraModule],
})
export class IntegrationsModule {}
