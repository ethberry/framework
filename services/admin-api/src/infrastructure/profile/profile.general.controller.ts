import { Body, Controller, Get, HttpStatus, Put, Res } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { Response } from "express";

import { Public, User } from "@gemunion/nest-js-utils";

import { UserEntity } from "../user/user.entity";
import { ProfileUpdateDto } from "./dto";
import { ProfileService } from "./profile.service";

@ApiBearerAuth()
@Controller("/profile")
export class ProfileGeneralController {
  constructor(private readonly profileService: ProfileService) {}

  @Public()
  @Get("/")
  public getProfile(@User() userEntity: UserEntity, @Res({ passthrough: true }) res: Response): UserEntity {
    if (!userEntity) {
      res.status(HttpStatus.NO_CONTENT);
    }
    return userEntity;
  }

  @Put("/")
  public setProfile(@User() userEntity: UserEntity, @Body() dto: ProfileUpdateDto): Promise<UserEntity> {
    return this.profileService.update(userEntity, dto);
  }
}
