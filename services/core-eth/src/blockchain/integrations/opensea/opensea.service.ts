import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";

import { TokenEntity } from "../../hierarchy/token/token.entity";

@Injectable()
export class OpenSeaService {
  constructor(private readonly httpService: HttpService) {}

  public async metadataUpdate(tokenEntity: TokenEntity): Promise<void> {
    await this.httpService
      .get(
        `https://api.opensea.io/api/v1/asset/${tokenEntity.template.contract.address}/${tokenEntity.tokenId}/?force_update=true`,
      )
      .toPromise();
  }
}
