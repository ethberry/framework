import { Erc998TemplateStatus } from "../../../entities";

export interface IErc998TemplateAutocompleteDto {
  templateStatus: Array<Erc998TemplateStatus>;
  erc998CollectionIds: Array<number>;
}
