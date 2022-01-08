import { Body, Controller, Delete, Get, Put, UseInterceptors } from "@nestjs/common";

import { PaginationInterceptor } from "@gemunion/nest-js-utils";

import { TransactionCreateDto, TransactionRemoveDto, TransactionSearchDto } from "./dto";
import { WatcherEntity } from "./watcher.entity";
import { WatcherService } from "./watcher.service";

@Controller("/transaction")
export class WatcherControllerHttp {
  constructor(private readonly transactionService: WatcherService) {}

  @Get("/search")
  @UseInterceptors(PaginationInterceptor)
  public search(@Body() dto: TransactionSearchDto): Promise<[Array<WatcherEntity>, number]> {
    return this.transactionService.search(dto);
  }

  @Put("/")
  public create(@Body() dto: TransactionCreateDto): Promise<WatcherEntity> {
    return this.transactionService.create(dto);
  }

  @Delete("/")
  public delete(@Body() dto: TransactionRemoveDto): Promise<WatcherEntity> {
    return this.transactionService.delete(dto);
  }
}
