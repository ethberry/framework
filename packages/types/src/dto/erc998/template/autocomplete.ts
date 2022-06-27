import { UniTemplateStatus } from "../../../entities";

export interface IErc998TemplateAutocompleteDto {
  templateStatus: Array<UniTemplateStatus>;
  uniContractIds: Array<number>;
}
