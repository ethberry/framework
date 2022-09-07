import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor, User } from "@gemunion/nest-js-utils";
import type { IServerSignature } from "@gemunion/types-collection";

import { ContractManagerSignService } from "./contract-manager.sign.service";
import { ContractManagerEntity } from "./contract-manager.entity";
import { ContractManagerService } from "./contract-manager.service";
import {
  ContractManagerCreateDto,
  ContractManagerSearchDto,
  ContractManagerUpdateDto,
  Erc1155ContractDeployDto,
  Erc20ContractDeployDto,
  Erc721ContractDeployDto,
  Erc998ContractDeployDto,
  MysteryContractDeployDto,
  VestingDeployDto,
} from "./dto";
import { UserEntity } from "../../user/user.entity";

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
  public vesting(@Body() dto: VestingDeployDto, @User() userEntity: UserEntity): Promise<IServerSignature> {
    return this.contractManagerSignService.vesting(dto, userEntity);
  }
}
