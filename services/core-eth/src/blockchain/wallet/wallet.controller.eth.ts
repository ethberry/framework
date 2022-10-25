import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "@ethersproject/abstract-provider";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import {
  ContractType,
  ExchangeEventType,
  IExchangePayeeAddedEvent,
  IExchangePaymentReceivedEvent,
} from "@framework/types";

import { WalletServiceEth } from "./wallet.service.eth";

@Controller()
export class WalletControllerEth {
  constructor(private readonly walletServiceEth: WalletServiceEth) {}

  @EventPattern([{ contractType: ContractType.EXCHANGE, eventName: ExchangeEventType.PayeeAdded }])
  public addPayee(@Payload() event: ILogEvent<IExchangePayeeAddedEvent>, @Ctx() context: Log): Promise<void> {
    return this.walletServiceEth.addPayee(event, context);
  }

  @EventPattern([
    {
      contractType: ContractType.EXCHANGE,
      eventName: ExchangeEventType.PaymentReceived,
    },
    {
      contractType: ContractType.EXCHANGE,
      eventName: ExchangeEventType.PaymentEthReceived,
    },
  ])
  public addEth(@Payload() event: ILogEvent<IExchangePaymentReceivedEvent>, @Ctx() context: Log): Promise<void> {
    return this.walletServiceEth.addEth(event, context);
  }

  @EventPattern([
    {
      contractType: ContractType.EXCHANGE,
      eventName: ExchangeEventType.PaymentEthSent,
    },
  ])
  public sentEth(@Payload() event: ILogEvent<IExchangePaymentReceivedEvent>, @Ctx() context: Log): Promise<void> {
    return this.walletServiceEth.sentEth(event, context);
  }
}
