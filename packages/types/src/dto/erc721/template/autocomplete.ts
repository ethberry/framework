import { Erc721TemplateStatus } from "../../../entities";

export interface IErc721TemplateAutocompleteDto {
  templateStatus: Array<Erc721TemplateStatus>;
  erc721CollectionIds: Array<number>;
}
