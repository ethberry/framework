import { Body, Controller, Post } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { User } from "@ethberry/nest-js-utils";
import type { IServerSignature } from "@ethberry/types-blockchain";

import { UserEntity } from "../../../infrastructure/user/user.entity";
import { ContractManagerPaymentSplitterSignService } from "./payment-splitter.sign.service";
import { PaymentSplitterContractDeployDto } from "./dto";

@ApiBearerAuth()
@Controller("/contract-manager")
export class ContractManagerPaymentSplitterController {
  constructor(private readonly contractManagerPaymentSplitterSignService: ContractManagerPaymentSplitterSignService) {}

  @Post("/payment-splitter")
  public wallet(
    @Body() dto: PaymentSplitterContractDeployDto,
    @User() userEntity: UserEntity,
  ): Promise<IServerSignature> {
    return this.contractManagerPaymentSplitterSignService.paymentSplitter(dto, userEntity);
  }
}
