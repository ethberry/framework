import { ChangeEvent, FC, Fragment, useState } from "react";
import { Tab, Tabs } from "@mui/material";
import { useIntl } from "react-intl";
import { useNavigate, useParams } from "react-router";

import { ProfileTabs } from "./tabs";
import { ProfileGeneral } from "./general";
import { ProfileSubscriptions } from "./subscriptions";
import { ProfileAddresses } from "./adresses";

export const Profile: FC = () => {
  const { tab = ProfileTabs.general } = useParams<{ tab: ProfileTabs }>();
  const { formatMessage } = useIntl();
  const navigate = useNavigate();

  const [value, setValue] = useState(tab);

  const handleChange = (_event: ChangeEvent<any>, newValue: ProfileTabs): void => {
    setValue(newValue);
    navigate(`/profile/${newValue === ProfileTabs.general ? "" : newValue}`);
  };

  return (
    <Fragment>
      <Tabs value={value} indicatorColor="primary" textColor="primary" onChange={handleChange}>
        {Object.values(ProfileTabs).map(tab => (
          <Tab key={tab} label={formatMessage({ id: `pages.profile.tabs.${tab}` })} value={tab} />
        ))}
      </Tabs>
      <br />
      <ProfileGeneral value={value} />
      <ProfileSubscriptions value={value} />
      <ProfileAddresses value={value} />
    </Fragment>
  );
};
