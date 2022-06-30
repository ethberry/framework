import { TemplateStatus } from "../../../entities";

export interface IErc721TemplateAutocompleteDto {
  templateStatus: Array<TemplateStatus>;
  contractIds: Array<number>;
}
