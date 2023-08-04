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

import { NotFoundInterceptor, PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import { UserEntity } from "../../../../infrastructure/user/user.entity";
import { ClaimEntity } from "../../claim/claim.entity";
import { VestingClaimService } from "./claim.service";
import { ClaimSearchDto, VestingClaimCreateDto, VestingClaimUpdateDto, VestingClaimUploadDto } from "./dto";

@ApiBearerAuth()
@Controller("/vesting/claims")
export class VestingClaimController {
  constructor(private readonly vestingClaimService: VestingClaimService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: ClaimSearchDto): Promise<[Array<ClaimEntity>, number]> {
    return this.vestingClaimService.search(dto);
  }

  @Post("/")
  public create(@Body() dto: VestingClaimCreateDto, @User() userEntity: UserEntity): Promise<ClaimEntity> {
    return this.vestingClaimService.create(dto, userEntity);
  }

  @Post("/upload")
  public upload(@Body() dto: VestingClaimUploadDto, @User() userEntity: UserEntity): Promise<Array<ClaimEntity>> {
    return this.vestingClaimService.upload(dto, userEntity);
  }

  @Put("/:id")
  public update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: VestingClaimUpdateDto,
    @User() userEntity: UserEntity,
  ): Promise<ClaimEntity | null> {
    return this.vestingClaimService.update({ id }, dto, userEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<ClaimEntity | null> {
    return this.vestingClaimService.findOne({ id }, { relations: { item: { components: true } } });
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("id", ParseIntPipe) id: number, @User() userEntity: UserEntity): Promise<void> {
    await this.vestingClaimService.delete({ id }, userEntity);
  }
}
