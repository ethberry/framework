import { UniTemplateStatus } from "../../../entities";

export interface IErc721TemplateAutocompleteDto {
  templateStatus: Array<UniTemplateStatus>;
  uniContractIds: Array<number>;
}
