import { Body, Controller, Post } from "@nestjs/common";

import { Public } from "@ethberry/nest-js-utils";
import type { IFirebaseToken } from "@ethberry/nest-js-module-particle";
import { ParticleDto } from "@ethberry/nest-js-module-particle";

import { AuthParticleService } from "./auth.particle.service";

@Public()
@Controller("/particle")
export class AuthParticleController {
  constructor(private readonly authParticleService: AuthParticleService) {}

  @Post("/login")
  public login(@Body() dto: ParticleDto): Promise<IFirebaseToken> {
    return this.authParticleService.login(dto);
  }
}
