import { Body, Controller, Get, Put } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { Roles } from "@gemunion/nest-js-utils";
import { SettingsKeys, UserRole } from "@framework/types";

import { SettingsService } from "./settings.service";
import { SettingsUpdateDto } from "./dto";

@ApiBearerAuth()
@Controller("/settings")
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get("/")
  public retrieve(): Promise<Record<SettingsKeys, any>> {
    return this.settingsService.retrieve();
  }

  @Put("/")
  @Roles(UserRole.ADMIN)
  public update(@Body() dto: SettingsUpdateDto): Promise<Record<SettingsKeys, any>> {
    return this.settingsService.update(dto);
  }
}
