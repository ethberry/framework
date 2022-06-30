import { TemplateStatus } from "../../../entities";

export interface IErc998TemplateAutocompleteDto {
  templateStatus: Array<TemplateStatus>;
  contractIds: Array<number>;
}
