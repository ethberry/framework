import { ApiProperty } from "@nestjs/swagger";
import { Allow } from "class-validator";

import { SettingsKeys } from "@framework/types";

import { ISettingsUpdateDto } from "../interfaces";

export class SettingsUpdateDto implements ISettingsUpdateDto {
  @ApiProperty()
  @Allow()
  public settings: Record<SettingsKeys, any>;
}
