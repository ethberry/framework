// import { ApiPropertyOptional } from "@nestjs/swagger";
// import { IsOptional, ValidateNested } from "class-validator";
// import { Type } from "class-transformer";

import { SearchableOptionalDto } from "@gemunion/collection";
import { IWaitListListUpdateDto } from "@framework/types";

// import { ItemDto } from "../../../../exchange/asset/dto";

export class WaitListListUpdateDto extends SearchableOptionalDto implements IWaitListListUpdateDto {
  // @ApiPropertyOptional({
  //   type: ItemDto,
  // })
  // @IsOptional()
  // @ValidateNested()
  // @Type(() => ItemDto)
  // public item: ItemDto;
}
