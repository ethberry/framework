import { TemplateStatus } from "../../../entities";

export interface IErc1155TemplateAutocompleteDto {
  templateStatus: Array<TemplateStatus>;
  contractIds: Array<number>;
}
