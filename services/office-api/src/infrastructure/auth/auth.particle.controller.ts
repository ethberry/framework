import { Body, Controller, Post } from "@nestjs/common";

import { Public } from "@gemunion/nest-js-utils";
import type { IParticleDto } from "@gemunion/nest-js-module-particle";

import { AuthParticleService } from "./auth.particle.service";
import type { ICustomToken } from "./interfaces";

@Controller("/particle")
export class AuthParticleController {
  constructor(private readonly authParticleService: AuthParticleService) {}

  @Public()
  @Post("/login")
  public login(@Body() dto: IParticleDto): Promise<ICustomToken> {
    return this.authParticleService.login(dto);
  }
}
