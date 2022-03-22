import { Body, Controller, Get, HttpStatus, Patch, Put, Res } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { Response } from "express";

import { Public, User } from "@gemunion/nest-js-utils";

import { ProfileService } from "./profile.service";
import { UserEntity } from "../user/user.entity";
import { PasswordUpdateDto, ProfileUpdateDto } from "./dto";

@ApiBearerAuth()
@Controller("/profile")
export class ProfileController {
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
  public setProfile(@User() userEntity: UserEntity, @Body() dto: ProfileUpdateDto): Promise<UserEntity | null> {
    return this.profileService.update(userEntity, dto);
  }

  @Patch("/password")
  public async password(@User() userEntity: UserEntity, @Body() dto: PasswordUpdateDto): Promise<void> {
    return this.profileService.password(userEntity, dto);
  }
}
