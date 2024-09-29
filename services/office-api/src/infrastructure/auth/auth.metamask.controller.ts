import { Body, Controller, Post } from "@nestjs/common";

import { Public } from "@ethberry/nest-js-utils";
import type { IFirebaseToken } from "@ethberry/nest-js-module-metamask";
import { MetamaskDto } from "@ethberry/nest-js-module-metamask";

import { AuthMetamaskService } from "./auth.metamask.service";

@Public()
@Controller("/metamask")
export class AuthMetamaskController {
  constructor(private readonly authMetamaskService: AuthMetamaskService) {}

  @Post("/login")
  public login(@Body() dto: MetamaskDto): Promise<IFirebaseToken> {
    return this.authMetamaskService.login(dto);
  }
}
