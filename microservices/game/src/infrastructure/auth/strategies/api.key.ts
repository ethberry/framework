import { HeaderAPIKeyStrategy as Strategy } from "passport-headerapikey";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";

import { MerchantService } from "../../merchant/merchant.service";
import { MerchantEntity } from "../../merchant/merchant.entity";

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(Strategy, "api-key") {
  constructor(private readonly merchantService: MerchantService) {
    super(
      {
        header: "Authorization",
        prefix: "Bearer ",
      },
      false,
    );
  }

  public async validate(apiKey: string): Promise<MerchantEntity> {
    const merchantEntity = await this.merchantService.findOne({ apiKey });
    if (!merchantEntity) {
      throw new UnauthorizedException("userHasWrongRole");
    }

    return merchantEntity;
  }
}
