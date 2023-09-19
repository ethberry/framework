import type { ISearchDto } from "@gemunion/types-collection";

import { GradeStatus } from "../../../../entities";

export interface IGradeSearchDto extends ISearchDto {
  gradeStatus: Array<GradeStatus>;
  merchantId: number;
}
