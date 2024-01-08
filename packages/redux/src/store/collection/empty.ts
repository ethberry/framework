import { ICollectionState } from "./interfaces";

export const emptyCollectionState: ICollectionState = {
  needRefresh: false,
  isLoading: false,
  isFiltersOpen: false,
  isViewDialogOpen: false,
  isEditDialogOpen: false,
  isDeleteDialogOpen: false,
  didMount: false,
  search: {},
  rows: [],
  count: 0,
  selected: {},
};
