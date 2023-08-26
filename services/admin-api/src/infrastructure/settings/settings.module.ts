import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { SettingsService } from "./settings.service";
import { SettingsEntity } from "./settings.entity";

// import { SettingsController } from "./settings.controller";

@Module({
  imports: [TypeOrmModule.forFeature([SettingsEntity])],
  providers: [SettingsService],
  // GEMUNION_BUSINESS_MODEL:B2C
  // controllers: [SettingsController],
  exports: [SettingsService],
})
export class SettingsModule {}
