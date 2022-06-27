import { UniTemplateStatus } from "../../../entities";

export interface IErc1155TemplateAutocompleteDto {
  templateStatus: Array<UniTemplateStatus>;
  uniContractIds: Array<number>;
}
