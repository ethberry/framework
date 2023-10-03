import { ChangeEvent, FC, useEffect, useState } from "react";
import { Tab, Tabs } from "@mui/material";
import { useIntl } from "react-intl";

import { IUser } from "@framework/types";
import { FormDialog } from "@gemunion/mui-dialog-form";

import { UserAddresses } from "./adresses";
import { UserFormTabs } from "./tabs";
import { UserGeneralForm } from "./general";
import { validationSchema } from "./validation";

export interface IUserEditDialogProps {
  open: boolean;
  onCancel: (form?: any) => void;
  onConfirm: (values: Partial<IUser>, form: any) => Promise<void>;
  initialValues: IUser;
}

export const UserEditDialog: FC<IUserEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { formatMessage } = useIntl();

  const [value, setValue] = useState(UserFormTabs.general);

  const handleChange = (_event: ChangeEvent<any>, newValue: UserFormTabs): void => {
    setValue(newValue);
  };

  const { id, email, displayName, language, gender, country, imageUrl, userRoles, userStatus, comment, createdAt } =
    initialValues;

  const fixedValues = {
    id,
    email,
    displayName,
    gender: gender ?? "",
    country: country ?? "",
    language,
    imageUrl,
    userRoles,
    userStatus,
    comment,
  };

  useEffect(() => {
    return () => {
      setValue(UserFormTabs.general);
    };
  }, []);

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message="dialogs.edit"
      testId="UserEditDialog"
      {...rest}
    >
      <Tabs value={value} indicatorColor="primary" textColor="primary" onChange={handleChange} sx={{ mb: 2 }}>
        {Object.values(UserFormTabs).map(tab => (
          <Tab key={tab} label={formatMessage({ id: `pages.profile.tabs.${tab}` })} value={tab} />
        ))}
      </Tabs>

      <UserGeneralForm createdAt={createdAt} open={value === UserFormTabs.general} />
      <UserAddresses userId={id} open={value === UserFormTabs.addresses} />
    </FormDialog>
  );
};
