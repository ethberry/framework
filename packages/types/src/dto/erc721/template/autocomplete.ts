import { UniTemplateStatus } from "../../../entities";

export interface IErc721TemplateAutocompleteDto {
  templateStatus: Array<UniTemplateStatus>;
  erc721CollectionIds: Array<number>;
}
