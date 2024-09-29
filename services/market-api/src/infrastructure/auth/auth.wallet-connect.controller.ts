import { Body, Controller, Post } from "@nestjs/common";

import { Public } from "@ethberry/nest-js-utils";
import type { IFirebaseToken } from "@ethberry/nest-js-module-wallet-connect";
import { WalletConnectDto } from "@ethberry/nest-js-module-wallet-connect";

import { AuthWalletConnectService } from "./auth.wallet-connect.service";

@Public()
@Controller("/wallet-connect")
export class AuthWalletConnectController {
  constructor(private readonly authWalletConnectService: AuthWalletConnectService) {}

  @Post("/login")
  public login(@Body() dto: WalletConnectDto): Promise<IFirebaseToken> {
    return this.authWalletConnectService.login(dto);
  }
}
