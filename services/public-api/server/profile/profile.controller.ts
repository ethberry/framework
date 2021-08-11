import {Request, Response} from "express";
import {Body, Controller, Get, Put, Req, Res} from "@nestjs/common";
import {ApiCookieAuth} from "@nestjs/swagger";

import {Public} from "@gemunionstudio/nest-js-providers";

import {User} from "../common/decorators";
import {ProfileService} from "./profile.service";
import {UserEntity} from "../user/user.entity";
import {ProfileUpdateDto} from "./dto";

@ApiCookieAuth()
@Controller("/profile")
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Public()
  @Get("/")
  public getProfile(@User() user: UserEntity, @Res() res: Response): void {
    res.json(user);
  }

  @Put("/")
  public setProfile(
    @Req() req: Request,
    @Res() res: Response,
    @User() user: UserEntity,
    @Body() body: ProfileUpdateDto,
  ): Promise<void> {
    return this.profileService.update(user, body, req, res);
  }
}
