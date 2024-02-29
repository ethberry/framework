import { ApiProperty } from "@nestjs/swagger";
import { ValidateNested, IsInt, IsEnum, Min } from "class-validator";
import { Type } from "class-transformer";

import { DismantleStrategy } from "@framework/types";

import { NotNativeDto, SemiNftDto } from "../../../../../exchange/asset/dto/custom";
import type { IDismantleCreateDto } from "../interfaces";

export class DismantleCreateDto implements IDismantleCreateDto {
  @ApiProperty({
    type: NotNativeDto,
  })
  @ValidateNested()
  @Type(() => NotNativeDto)
  public item: InstanceType<typeof NotNativeDto>;

  @ApiProperty({
    type: SemiNftDto,
  })
  @ValidateNested()
  @Type(() => SemiNftDto)
  public price: InstanceType<typeof SemiNftDto>;

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
