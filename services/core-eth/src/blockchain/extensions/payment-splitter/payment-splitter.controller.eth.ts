import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "@ethersproject/abstract-provider";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import {
  ContractType,
  ExchangeEventType,
  IExchangeErc20PaymentReleasedEvent,
  IExchangePayeeAddedEvent,
  IExchangePaymentReceivedEvent,
  IExchangePaymentReleasedEvent,
} from "@framework/types";

import { PaymentSplitterServiceEth } from "./payment-splitter.service.eth";

@Controller()
export class PaymentSplitterControllerEth {
  constructor(private readonly paymentSplitterServiceEth: PaymentSplitterServiceEth) {}

  @EventPattern([
    { contractType: ContractType.EXCHANGE, eventName: ExchangeEventType.PayeeAdded },
    { contractType: ContractType.PYRAMID, eventName: ExchangeEventType.PayeeAdded },
  ])
  public addPayee(@Payload() event: ILogEvent<IExchangePayeeAddedEvent>, @Ctx() context: Log): Promise<void> {
    return this.paymentSplitterServiceEth.addPayee(event, context);
  }

  @EventPattern([
    {
      contractType: ContractType.EXCHANGE,
      eventName: ExchangeEventType.PaymentReceived,
    },
    {
      contractType: ContractType.PYRAMID,
      eventName: ExchangeEventType.PaymentReceived,
    },
  ])
  public addEth(@Payload() event: ILogEvent<IExchangePaymentReceivedEvent>, @Ctx() context: Log): Promise<void> {
    return this.paymentSplitterServiceEth.addEth(event, context);
  }

  @EventPattern([
    {
      contractType: ContractType.EXCHANGE,
      eventName: ExchangeEventType.PaymentReleased,
    },
    {
      contractType: ContractType.PYRAMID,
      eventName: ExchangeEventType.PaymentReleased,
    },
  ])
  public releaseEth(@Payload() event: ILogEvent<IExchangePaymentReleasedEvent>, @Ctx() context: Log): Promise<void> {
    return this.paymentSplitterServiceEth.releaseEth(event, context);
  }

  @EventPattern([
    {
      contractType: ContractType.EXCHANGE,
      eventName: ExchangeEventType.ERC20PaymentReleased,
    },
    {
      contractType: ContractType.PYRAMID,
      eventName: ExchangeEventType.ERC20PaymentReleased,
    },
  ])
  public releaseErc20(
    @Payload() event: ILogEvent<IExchangeErc20PaymentReleasedEvent>,
    @Ctx() context: Log,
  ): Promise<void> {
    return this.paymentSplitterServiceEth.releaseErc20(event, context);
  }

  // TODO add dedicated release history table? {from, to, token, amount}
}
