import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { Log } from "@ethersproject/abstract-provider";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import { IUnpackWrapper } from "@framework/types";

import { ContractService } from "../../hierarchy/contract/contract.service";
import { ContractHistoryService } from "../../contract-history/contract-history.service";
import { TokenService } from "../../hierarchy/token/token.service";
import { TokenServiceEth } from "../../hierarchy/token/token.service.eth";

@Injectable()
export class WrapperServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly contractHistoryService: ContractHistoryService,
    private readonly contractService: ContractService,
    private readonly tokenService: TokenService,
    private readonly tokenServiceEth: TokenServiceEth,
  ) {}

  public async unpack(event: ILogEvent<IUnpackWrapper>, context: Log): Promise<void> {
    const {
      args: { tokenId },
    } = event;

    const tokenEntity = await this.tokenService.getToken(tokenId, context.address.toLowerCase());

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    await this.tokenServiceEth.updateHistory(event, context, void 0, tokenEntity.id);
  }
}
