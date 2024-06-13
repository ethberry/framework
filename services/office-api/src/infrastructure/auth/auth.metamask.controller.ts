import { Body, Controller, Post } from "@nestjs/common";

import { Public } from "@gemunion/nest-js-utils";
import type { IFirebaseToken } from "@gemunion/nest-js-module-metamask";
import { MetamaskDto } from "@gemunion/nest-js-module-metamask";

import { AuthMetamaskService } from "./auth.metamask.service";

@Controller("/metamask")
export class AuthMetamaskController {
  constructor(private readonly authMetamaskService: AuthMetamaskService) {}

  @Public()
  @Post("/login")
  public login(@Body() dto: MetamaskDto): Promise<IFirebaseToken> {
    return this.authMetamaskService.login(dto);
  }
}
