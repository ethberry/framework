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
import { SearchableDto, SearchableOptionalDto, SearchDto } from "@gemunion/collection";

import { WaitlistListService } from "./list.service";
import { WaitlistListEntity } from "./list.entity";
import { WaitlistGenerateDto } from "./dto";

@ApiBearerAuth()
@Controller("/waitlist/list")
export class WaitlistListController {
  constructor(private readonly waitlistListService: WaitlistListService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: SearchDto): Promise<[Array<WaitlistListEntity>, number]> {
    return this.waitlistListService.search(dto);
  }

  @Post("/")
  public create(@Body() dto: SearchableDto): Promise<WaitlistListEntity> {
    return this.waitlistListService.create(dto);
  }

  @Post("/generate")
  public generate(@Body() dto: WaitlistGenerateDto): Promise<{ root: string }> {
    return this.waitlistListService.generate(dto);
  }

  @Get("/autocomplete")
  public autocomplete(): Promise<Array<WaitlistListEntity>> {
    return this.waitlistListService.autocomplete();
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<WaitlistListEntity | null> {
    return this.waitlistListService.findOne({ id });
  }

  @Put("/:id")
  public update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: SearchableOptionalDto,
  ): Promise<WaitlistListEntity | null> {
    return this.waitlistListService.update({ id }, dto);
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("id", ParseIntPipe) id: number): Promise<void> {
    await this.waitlistListService.delete({ id });
  }
}
