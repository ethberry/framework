import { Controller, Get, Ip, UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { Public, User } from "@gemunion/nest-js-utils";
import { JwtFacebookGuard, JwtGoogleGuard } from "@gemunion/nest-js-guards";

import { UserEntity } from "../user/user.entity";
import { AuthService } from "./auth.service";

@Public()
@Controller("/auth")
export class AuthSocialController {
  constructor(private readonly authService: AuthService, private readonly configService: ConfigService) {}

  @Get("google")
  @UseGuards(JwtGoogleGuard)
  public googleLogin(): void {
    // initiates the Google OAuth2 login flow
  }

  @Get("google/callback")
  @UseGuards(JwtGoogleGuard)
  public async googleLoginCallback(@User() userEntity: UserEntity, @Ip() ip: string): Promise<string> {
    const auth = await this.authService.loginUser(userEntity, ip);
    const baseUrl = this.configService.get<string>("PUBLIC_FE_URL", "http://localhost:3005");
    return `
      <html lang="en">
      	<script>
					function handleAuth() {
            window.opener.postMessage(${JSON.stringify(auth)}, "${baseUrl}");
            window.close();
					}
				</script>
        <body onload="handleAuth()" />
      </html>
    `;
  }

  @Get("facebook")
  @UseGuards(JwtFacebookGuard)
  public facebookLogin(): void {
    // initiates the Facebook OAuth2 login flow
  }

  @Get("facebook/callback")
  @UseGuards(JwtFacebookGuard)
  public async facebookLoginCallback(@User() userEntity: UserEntity, @Ip() ip: string): Promise<string> {
    const auth = await this.authService.loginUser(userEntity, ip);
    const baseUrl = this.configService.get<string>("PUBLIC_FE_URL", "http://localhost:3005");
    return `
      <html lang="en">
      	<script>
					function handleAuth() {
            window.opener.postMessage(${JSON.stringify(auth)}, "${baseUrl}");
            window.close();
					}
				</script>
        <body onload="handleAuth()" />
      </html>
    `;
  }
}
