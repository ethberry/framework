export interface ICollectionState<T = any, S = any> {
  needRefresh: boolean;
  isLoading: boolean;
  isFiltersOpen: boolean;
  isViewDialogOpen: boolean;
  isEditDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
  didMount: boolean;
  search: S;
  rows: Array<T>;
  count: number;
  selected: T;
}
