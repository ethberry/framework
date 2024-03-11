import { ApiProperty } from "@nestjs/swagger";
import { ValidateNested, IsInt, IsEnum, Min } from "class-validator";
import { Type } from "class-transformer";

import { DismantleStrategy } from "@framework/types";

import { NotNativeDto, NftDto } from "../../../../../exchange/asset/dto";
import type { IDismantleCreateDto } from "../interfaces";

export class DismantleCreateDto implements IDismantleCreateDto {
  @ApiProperty({
    type: NotNativeDto,
  })
  @ValidateNested()
  @Type(() => NotNativeDto)
  public item: InstanceType<typeof NotNativeDto>;

  @ApiProperty({
    type: NftDto,
  })
  @ValidateNested()
  @Type(() => NftDto)
  public price: InstanceType<typeof NftDto>;

  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  @Min(0, { message: "rangeUnderflow" })
  // unfortunately there is no such property, so we just save
  // @ValidateIf(o => o.item.components[0].contract.contractFeatures.includes(ContractFeatures.RANDOM))
  public rarityMultiplier: number;

  @ApiProperty()
  @IsEnum(DismantleStrategy, { message: "badInput" })
  public dismantleStrategy: DismantleStrategy;
}
