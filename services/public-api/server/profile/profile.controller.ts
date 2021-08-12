import { Body, Controller, Get, Put, Patch } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { Public, User } from "@gemunionstudio/nest-js-utils";

import { ProfileService } from "./profile.service";
import { UserEntity } from "../user/user.entity";
import { PasswordUpdateDto, ProfileUpdateDto } from "./dto";

@ApiBearerAuth()
@Controller("/profile")
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Public()
  @Get("/")
  public getProfile(@User() userEntity: UserEntity): UserEntity {
    return userEntity;
  }

  @Put("/")
  public setProfile(@User() userEntity: UserEntity, @Body() dto: ProfileUpdateDto): Promise<UserEntity | undefined> {
    return this.profileService.update(userEntity, dto);
  }

  @Patch("/password")
  public async password(@User() userEntity: UserEntity, @Body() dto: PasswordUpdateDto): Promise<void> {
    return this.profileService.password(userEntity, dto);
  }
}
