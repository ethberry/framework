import { Body, Controller, Post } from "@nestjs/common";

import { Public } from "@gemunion/nest-js-utils";
import type { IFirebaseToken } from "@gemunion/nest-js-module-particle";
import { ParticleDto } from "@gemunion/nest-js-module-particle";

import { AuthParticleService } from "./auth.particle.service";

@Controller("/particle")
export class AuthParticleController {
  constructor(private readonly authParticleService: AuthParticleService) {}

  @Public()
  @Post("/login")
  public login(@Body() dto: ParticleDto): Promise<IFirebaseToken> {
    return this.authParticleService.login(dto);
  }
}
