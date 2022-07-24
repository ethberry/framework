import { HeaderAPIKeyStrategy as Strategy } from "passport-headerapikey";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(Strategy, "api-key") {
  constructor(private readonly configService: ConfigService) {
    super(
      {
        header: "Authorization",
        prefix: "Bearer ",
      },
      false,
    );
  }

  public validate(apiKey: string): Record<string, string> {
    const gameApiKey = this.configService.get<string>("GAME_MICROSERVICE_API_KEY", "");

    if (apiKey !== gameApiKey) {
      throw new UnauthorizedException("invalidKey");
    }

    return {};
  }
}
