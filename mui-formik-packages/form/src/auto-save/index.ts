import { FC, useEffect } from "react";
import { useWatch } from "react-hook-form";
import { useDebouncedCallback } from "use-debounce";

interface IAutoSaveProps {
  onSearch: (values: any) => void;
}

export const AutoSave: FC<IAutoSaveProps> = props => {
  const { onSearch } = props;

  const watch = useWatch();

  const debouncedOnSearch = useDebouncedCallback(() => onSearch(watch), 300);

  useEffect(() => {
    debouncedOnSearch();
  }, [watch]);

  return null;
};
