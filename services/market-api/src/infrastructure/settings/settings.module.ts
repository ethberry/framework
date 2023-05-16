import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { SettingsService } from "./settings.service";
import { SettingsEntity } from "./settings.entity";

@Module({
  imports: [TypeOrmModule.forFeature([SettingsEntity])],
  providers: [SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {}
