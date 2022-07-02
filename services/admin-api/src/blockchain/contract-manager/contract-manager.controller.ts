import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor } from "@gemunion/nest-js-utils";
import { IServerSignature } from "@gemunion/types-collection";

import { ContractManagerSignService } from "./contract-manager.sign.service";
import { ContractManagerEntity } from "./contract-manager.entity";
import { ContractManagerService } from "./contract-manager.service";

import {
  ContractManagerCreateDto,
  ContractManagerSearchDto,
  Erc1155TokenDeployDto,
  Erc20TokenDeployDto,
  VestingDeployDto,
  Erc721TokenDeployDto,
} from "./dto";
import { IContractManagerUpdateDto } from "./interfaces";

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
    @Body() dto: IContractManagerUpdateDto,
  ): Promise<ContractManagerEntity | null> {
    return this.contractManagerService.update({ id }, dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<ContractManagerEntity | null> {
    return this.contractManagerService.findOne({ id });
  }

  // todo probably remove it
  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("id", ParseIntPipe) id: number): Promise<void> {
    await this.contractManagerService.delete({ id });
  }

  @Post("/erc20-token")
  public erc20Token(@Body() dto: Erc20TokenDeployDto): Promise<IServerSignature> {
    return this.contractManagerSignService.erc20Token(dto);
  }

  @Post("/erc20-vesting")
  public erc20Vesting(@Body() dto: VestingDeployDto): Promise<IServerSignature> {
    return this.contractManagerSignService.erc20Vesting(dto);
  }

  @Post("/erc721-token")
  public erc721Token(@Body() dto: Erc721TokenDeployDto): Promise<IServerSignature> {
    return this.contractManagerSignService.erc721Token(dto);
  }

  @Post("/erc1155-token")
  public erc1155Token(@Body() dto: Erc1155TokenDeployDto): Promise<IServerSignature> {
    return this.contractManagerSignService.erc1155Token(dto);
  }
}
