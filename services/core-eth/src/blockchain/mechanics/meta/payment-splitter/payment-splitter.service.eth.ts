import { Injectable, NotFoundException } from "@nestjs/common";
import { Log, ZeroAddress } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import type {
  IPaymentSplitterERC20PaymentReleasedEvent,
  IPaymentSplitterPayeeAddedEvent,
  IPaymentSplitterPaymentReceivedEvent,
  IPaymentSplitterPaymentReleasedEvent,
} from "@framework/types";

import { ContractService } from "../../../hierarchy/contract/contract.service";
import { BalanceService } from "../../../hierarchy/balance/balance.service";
import { TokenService } from "../../../hierarchy/token/token.service";
import { EventHistoryService } from "../../../event-history/event-history.service";
import { PayeesService } from "./payee/payees.service";

@Injectable()
export class PaymentSplitterServiceEth {
  constructor(
    private readonly payeesService: PayeesService,
    private readonly contractService: ContractService,
    private readonly tokenService: TokenService,
    private readonly balanceService: BalanceService,
    private readonly eventHistoryService: EventHistoryService,
  ) {}

  public async addPayee(event: ILogEvent<IPaymentSplitterPayeeAddedEvent>, context: Log): Promise<void> {
    const {
      args: { account, shares },
    } = event;
    await this.eventHistoryService.updateHistory(event, context);

    const contractEntity = await this.contractService.findOne({ address: context.address.toLowerCase() });

    if (!contractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    await this.payeesService.create({
      account: account.toLowerCase(),
      shares: Number(shares),
      contractId: contractEntity.id,
    });
  }

  public async addEth(event: ILogEvent<IPaymentSplitterPaymentReceivedEvent>, context: Log): Promise<void> {
    const {
      args: { amount },
    } = event;
    await this.eventHistoryService.updateHistory(event, context);

    const tokenEntity = await this.tokenService.getToken(0n, ZeroAddress);

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    await this.balanceService.increment(tokenEntity.id, context.address.toLowerCase(), amount);
  }

  public async releaseEth(event: ILogEvent<IPaymentSplitterPaymentReleasedEvent>, context: Log): Promise<void> {
    const {
      args: { amount },
    } = event;
    await this.eventHistoryService.updateHistory(event, context);

    const tokenEntity = await this.tokenService.getToken(0n, ZeroAddress);

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    await this.balanceService.decrement(tokenEntity.id, context.address.toLowerCase(), amount);
  }

  public async releaseErc20(event: ILogEvent<IPaymentSplitterERC20PaymentReleasedEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);
    // Balance will decrement by Erc20 controller
  }
}
