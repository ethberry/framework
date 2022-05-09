import { FC } from "react";
import { useFormikContext } from "formik";

import { EntityInput } from "@gemunion/mui-inputs-entity";
import { SwitchInput } from "@gemunion/mui-inputs-core";

export interface IRandomInputProps {
  name: string;
}

export const RandomInput: FC<IRandomInputProps> = props => {
  const { name } = props;

  const formik = useFormikContext<any>();
  const value = formik.values[name];

  return (
    <>
      <SwitchInput name="random" />
      {value ? (
        <EntityInput name="erc721DropboxId" controller="erc721-dropboxes" />
      ) : (
        <EntityInput name="erc721TemplateId" controller="erc721-templates" />
      )}
    </>
  );
};
