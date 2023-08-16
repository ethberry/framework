import { Body, Controller, Post } from "@nestjs/common";

import { Public } from "@gemunion/nest-js-utils";
import type { IMetamaskDto } from "@gemunion/types-jwt";

import { AuthMetamaskService } from "./auth.metamask.service";
import type { ICustomToken } from "./interfaces";

@Controller("/metamask")
export class AuthMetamaskController {
  constructor(private readonly metamaskService: AuthMetamaskService) {}

  @Public()
  @Post("/login")
  public login(@Body() dto: IMetamaskDto): Promise<ICustomToken> {
    return this.metamaskService.login(dto);
  }
}
