import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { addDays } from "date-fns";

import type { IClaim, IClaimItemCreateDto } from "@framework/types";
import { GameEventType, RmqProviderType, TokenType } from "@framework/types";

import { UserEntity } from "../../../infrastructure/user/user.entity";

@Injectable()
export class ClaimService {
  constructor(
    @Inject(RmqProviderType.GAME_SERVICE)
    private mobileClientProxy: ClientProxy,
  ) {}

  public async test(userEntity: UserEntity): Promise<IClaim | undefined> {
    return this.mobileClientProxy
      .send<IClaim, IClaimItemCreateDto>(GameEventType.CLAIM_TEST, {
        account: userEntity.wallet,
        item: {
          components: [
            {
              tokenType: TokenType.ERC721,
              contractId: 1301,
              templateId: 130101,
              amount: "1",
            },
          ],
        },
        endTimestamp: addDays(new Date(), 1).toISOString(),
      })
      .toPromise();
  }
}
