import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Put, Res } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import type { Response } from "express";

import { Public, User } from "@gemunion/nest-js-utils";
import { MetamaskDto } from "@gemunion/nest-js-module-metamask";

import { ProfileService } from "./profile.service";
import { UserEntity } from "../user/user.entity";
import { ProfileUpdateDto } from "./dto";

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
  public setProfile(@User() userEntity: UserEntity, @Body() dto: ProfileUpdateDto): Promise<UserEntity> {
    return this.profileService.update(userEntity, dto);
  }

  @Delete("/")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteProfile(@User() userEntity: UserEntity): Promise<void> {
    await this.profileService.delete(userEntity);
  }

  @Post("/wallet")
  public attachWallet(@User() userEntity: UserEntity, @Body() dto: MetamaskDto): Promise<UserEntity> {
    return this.profileService.attach(userEntity, dto);
  }

  @Delete("/wallet")
  public detachWallet(@User() userEntity: UserEntity): Promise<UserEntity> {
    return this.profileService.detach(userEntity);
  }
}
