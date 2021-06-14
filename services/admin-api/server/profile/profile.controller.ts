import {Request, Response} from "express";
import {Body, Controller, Get, Put, Req, Res} from "@nestjs/common";
import {ApiCookieAuth} from "@nestjs/swagger";

import {Public} from "@trejgun/nest-js-providers";

import {User} from "../common/decorators";
import {ProfileService} from "./profile.service";
import {UserEntity} from "../user/user.entity";
import {ProfileUpdateSchema} from "./schemas";

@ApiCookieAuth()
@Controller("/profile")
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Public()
  @Get("/")
  public getProfile(@User() userEntity: UserEntity, @Res() res: Response): void {
    res.json(userEntity);
  }

  @Put("/")
  public setProfile(
    @Req() req: Request,
    @Res() res: Response,
    @User() user: UserEntity,
    @Body() body: ProfileUpdateSchema,
  ): Promise<void> {
    return this.profileService.update(user, body, req, res);
  }
}
