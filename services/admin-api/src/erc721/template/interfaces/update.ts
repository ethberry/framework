import { Erc721TemplateStatus } from "@framework/types";

import { IErc721TemplateCreateDto } from "./create";

export interface IErc721TemplateUpdateDto extends IErc721TemplateCreateDto {
  templateStatus: Erc721TemplateStatus;
}
