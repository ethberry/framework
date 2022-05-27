import { FC } from "react";
import { useFormContext } from "react-hook-form";

import { EntityInput } from "@gemunion/mui-inputs-entity";
import { SwitchInput } from "@gemunion/mui-inputs-core";

export interface IRandomInputProps {
  name: string;
}

export const RandomInput: FC<IRandomInputProps> = props => {
  const { name } = props;

  const form = useFormContext<any>();
  const value = form.getValues(name);

  return (
    <>
      <SwitchInput name="random" />
      {value ? (
        <EntityInput name="erc721DropboxId" controller="erc721-dropboxes" key={"dropbox"} />
      ) : (
        <EntityInput name="erc721TemplateId" controller="erc721-templates" key={"template"} />
      )}
    </>
  );
};
