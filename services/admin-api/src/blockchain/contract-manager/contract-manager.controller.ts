import { Body, Controller, Post } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { User } from "@gemunion/nest-js-utils";
import type { IServerSignature } from "@gemunion/types-blockchain";

import { ContractManagerSignService } from "./contract-manager.sign.service";
import { ContractManagerService } from "./contract-manager.service";
import {
  Erc1155ContractDeployDto,
  Erc20ContractDeployDto,
  Erc721CollectionDeployDto,
  Erc721ContractDeployDto,
  Erc998ContractDeployDto,
  LotteryContractDeployDto,
  MysteryContractDeployDto,
  PonziContractDeployDto,
  StakingContractDeployDto,
  VestingContractDeployDto,
} from "./dto";
import { UserEntity } from "../../infrastructure/user/user.entity";
import { PaymentSplitterContractDeployDto } from "./dto/payment-splitter";

@ApiBearerAuth()
@Controller("/contract-manager")
export class ContractManagerController {
  constructor(
    private readonly contractManagerSignService: ContractManagerSignService,
    private readonly contractManagerService: ContractManagerService,
  ) {}

  @Post("/erc20")
  public erc20Token(@Body() dto: Erc20ContractDeployDto, @User() userEntity: UserEntity): Promise<IServerSignature> {
    return this.contractManagerSignService.erc20Token(dto, userEntity);
  }

  @Post("/erc721")
  public erc721Token(@Body() dto: Erc721ContractDeployDto, @User() userEntity: UserEntity): Promise<IServerSignature> {
    return this.contractManagerSignService.erc721Token(dto, userEntity);
  }

  @Post("/erc998")
  public erc998Token(@Body() dto: Erc998ContractDeployDto, @User() userEntity: UserEntity): Promise<IServerSignature> {
    return this.contractManagerSignService.erc998Token(dto, userEntity);
  }

  @Post("/erc1155")
  public erc1155Token(
    @Body() dto: Erc1155ContractDeployDto,
    @User() userEntity: UserEntity,
  ): Promise<IServerSignature> {
    return this.contractManagerSignService.erc1155Token(dto, userEntity);
  }

  // MODULE:MYSTERY
  @Post("/mysterybox")
  public mysterybox(@Body() dto: MysteryContractDeployDto, @User() userEntity: UserEntity): Promise<IServerSignature> {
    return this.contractManagerSignService.mystery(dto, userEntity);
  }

  // MODULE:VESTING
  @Post("/vesting")
  public vesting(@Body() dto: VestingContractDeployDto, @User() userEntity: UserEntity): Promise<IServerSignature> {
    return this.contractManagerSignService.vesting(dto, userEntity);
  }

  // MODULE:COLLECTION
  @Post("/erc721collection")
  public collection(@Body() dto: Erc721CollectionDeployDto, @User() userEntity: UserEntity): Promise<IServerSignature> {
    return this.contractManagerSignService.collection(dto, userEntity);
  }

  // MODULE:STAKING
  @Post("/staking")
  public staking(@Body() dto: StakingContractDeployDto, @User() userEntity: UserEntity): Promise<IServerSignature> {
    return this.contractManagerSignService.staking(dto, userEntity);
  }

  // MODULE:PONZI
  @Post("/ponzi")
  public ponzi(@Body() dto: PonziContractDeployDto, @User() userEntity: UserEntity): Promise<IServerSignature> {
    return this.contractManagerSignService.ponzi(dto, userEntity);
  }

  // MODULE:WAITLIST
  @Post("/wait-list")
  public waitList(@User() userEntity: UserEntity): Promise<IServerSignature> {
    return this.contractManagerSignService.waitList(userEntity);
  }

  // MODULE:RAFFLE
  @Post("/raffle")
  public raffle(@User() userEntity: UserEntity): Promise<IServerSignature> {
    return this.contractManagerSignService.raffle(userEntity);
  }

  // MODULE:LOTTERY
  @Post("/lottery")
  public lottery(@Body() dto: LotteryContractDeployDto, @User() userEntity: UserEntity): Promise<IServerSignature> {
    return this.contractManagerSignService.lottery(dto, userEntity);
  }

  // MODULE:PAYMENT-SPLITTER
  @Post("/payment-splitter")
  public wallet(
    @Body() dto: PaymentSplitterContractDeployDto,
    @User() userEntity: UserEntity,
  ): Promise<IServerSignature> {
    return this.contractManagerSignService.paymentSplitter(dto, userEntity);
  }
}
