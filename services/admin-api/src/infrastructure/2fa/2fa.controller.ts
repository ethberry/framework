import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { User } from "@gemunion/nest-js-utils";

import { UserEntity } from "../user/user.entity";
import { I2FATokenDto } from "./interfaces";
import { TwoFAService } from "./2fa.service";
import { TwoFAEntity } from "./2fa.entity";

@ApiBearerAuth()
@Controller("/2fa")
export class TwoFAController {
  constructor(private readonly twoFAService: TwoFAService) {}

  @Get("/")
  public search(@User() userEntity: UserEntity): Promise<Pick<TwoFAEntity, "isActive">> {
    return this.twoFAService.search(userEntity);
  }

  @Get("/activate")
  public activate(@User() userEntity: UserEntity): Promise<Pick<TwoFAEntity, "isActive">> {
    return this.twoFAService.activate(userEntity);
  }

  @Get("/deactivate")
  public deactivate(@User() userEntity: UserEntity): Promise<Pick<TwoFAEntity, "isActive">> {
    return this.twoFAService.deactivate(userEntity);
  }

  @Post("/verify")
  public verify(@Body() dto: I2FATokenDto, @User() userEntity: UserEntity): Promise<boolean> {
    return this.twoFAService.verify(dto, userEntity);
  }
}
