import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import type { IContractManagerPaymentSplitterDeployedEvent } from "@framework/types";
import { ContractManagerEventType } from "@framework/types";

import { ContractType } from "../../../utils/contract-type";
import { ContractManagerPaymentSplitterServiceEth } from "./payment-splitter.service.eth";

@Controller()
export class ContractManagerPaymentSplitterControllerEth {
  constructor(private readonly contractManagerPaymentSplitterServiceEth: ContractManagerPaymentSplitterServiceEth) {}

  @EventPattern({
    contractType: ContractType.CONTRACT_MANAGER,
    eventName: ContractManagerEventType.PaymentSplitterDeployed,
  })
  public deploy(
    @Payload() event: ILogEvent<IContractManagerPaymentSplitterDeployedEvent>,
    @Ctx() ctx: Log,
  ): Promise<void> {
    return this.contractManagerPaymentSplitterServiceEth.deploy(event, ctx);
  }
}
