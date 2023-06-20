import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor, User } from "@gemunion/nest-js-utils";
import type { IServerSignature } from "@gemunion/types-blockchain";

import { ContractManagerSignService } from "./contract-manager.sign.service";
import { ContractManagerEntity } from "./contract-manager.entity";
import { ContractManagerService } from "./contract-manager.service";
import {
  ContractManagerCreateDto,
  ContractManagerSearchDto,
  ContractManagerUpdateDto,
  Erc1155ContractDeployDto,
  Erc20ContractDeployDto,
  Erc721CollectionDeployDto,
  Erc721ContractDeployDto,
  Erc998ContractDeployDto,
  LotteryContractDeployDto,
  MysteryContractDeployDto,
  PyramidContractDeployDto,
  RaffleContractDeployDto,
  StakingContractDeployDto,
  VestingContractDeployDto,
  WaitListContractDeployDto,
} from "./dto";
import { UserEntity } from "../../infrastructure/user/user.entity";

@ApiBearerAuth()
@Controller("/contract-manager")
export class ContractManagerController {
  constructor(
    private readonly contractManagerSignService: ContractManagerSignService,
    private readonly contractManagerService: ContractManagerService,
  ) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: ContractManagerSearchDto): Promise<[Array<ContractManagerEntity>, number]> {
    return this.contractManagerService.search(dto);
  }

  @Post("/")
  public create(@Body() dto: ContractManagerCreateDto): Promise<ContractManagerEntity | null> {
    return this.contractManagerService.create(dto);
  }

  @Put("/:id")
  public update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: ContractManagerUpdateDto,
  ): Promise<ContractManagerEntity | null> {
    return this.contractManagerService.update({ id }, dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<ContractManagerEntity | null> {
    return this.contractManagerService.findOne({ id });
  }

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
    return this.contractManagerSignService.mysterybox(dto, userEntity);
  }

  // MODULE:VESTING
  @Post("/vesting")
  public vesting(@Body() dto: VestingContractDeployDto, @User() userEntity: UserEntity): Promise<IServerSignature> {
    return this.contractManagerSignService.vesting(dto, userEntity);
  }

  // MODULE:COLLECTION
  @Post("/erc721collection")
  public collection(@Body() dto: Erc721CollectionDeployDto, @User() userEntity: UserEntity): Promise<IServerSignature> {
    return this.contractManagerSignService.erc721Collection(dto, userEntity);
  }

  // MODULE:STAKING
  @Post("/staking")
  public staking(@Body() dto: StakingContractDeployDto, @User() userEntity: UserEntity): Promise<IServerSignature> {
    return this.contractManagerSignService.staking(dto, userEntity);
  }

  // MODULE:PYRAMID
  @Post("/pyramid")
  public pyramid(@Body() dto: PyramidContractDeployDto, @User() userEntity: UserEntity): Promise<IServerSignature> {
    return this.contractManagerSignService.pyramid(dto, userEntity);
  }

  // MODULE:WAITLIST
  @Post("/waitlist")
  public waitList(@Body() dto: WaitListContractDeployDto, @User() userEntity: UserEntity): Promise<IServerSignature> {
    return this.contractManagerSignService.waitList(dto, userEntity);
  }

  // MODULE:RAFFLE
  @Post("/raffle")
  public raffle(@Body() dto: RaffleContractDeployDto, @User() userEntity: UserEntity): Promise<IServerSignature> {
    return this.contractManagerSignService.raffle(dto, userEntity);
  }

  // MODULE:LOTTERY
  @Post("/lottery")
  public lottery(@Body() dto: LotteryContractDeployDto, @User() userEntity: UserEntity): Promise<IServerSignature> {
    return this.contractManagerSignService.lottery(dto, userEntity);
  }
}
