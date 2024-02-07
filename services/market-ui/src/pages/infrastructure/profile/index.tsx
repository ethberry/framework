import { ChangeEvent, FC, Fragment, useState } from "react";
import { Tab } from "@mui/material";
import { useIntl } from "react-intl";
import { useNavigate, useParams } from "react-router";

import { NodeEnv } from "@framework/types";
import { PageHeader } from "@gemunion/mui-page-layout";

import { ProfileAddresses } from "./adresses";
import { ProfileGeneral } from "./general";
import { ProfileSubscriptions } from "./subscriptions";
import { ProfileTabs } from "./interfaces";
import { StyledTabs } from "./styled";

export const Profile: FC = () => {
  const { tab = ProfileTabs.general } = useParams<{ tab: ProfileTabs }>();
  const { formatMessage } = useIntl();
  const navigate = useNavigate();

  const [value, setValue] = useState(tab);

  const handleChange = (_event: ChangeEvent<any>, newValue: ProfileTabs): void => {
    setValue(newValue);
    navigate(`/profile/${newValue === ProfileTabs.general ? "" : newValue}`);
  };

  const shouldHideAddress = process.env.NODE_ENV === NodeEnv.production;

  return (
    <Fragment>
      <PageHeader message="pages.profile.title" />

      <StyledTabs value={value} indicatorColor="primary" textColor="primary" onChange={handleChange}>
        {Object.values(ProfileTabs).map(tab =>
          shouldHideAddress && tab === ProfileTabs.addresses ? null : (
            <Tab key={tab} label={formatMessage({ id: `pages.profile.tabs.${tab}` })} value={tab} />
          ),
        )}
      </StyledTabs>
      <ProfileGeneral open={value === ProfileTabs.general} />
      {!shouldHideAddress ? <ProfileAddresses open={value === ProfileTabs.addresses} /> : null}
      <ProfileSubscriptions open={value === ProfileTabs.subscriptions} />
    </Fragment>
  );
};
