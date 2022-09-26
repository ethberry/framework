import { FC, Fragment, PropsWithChildren } from "react";
import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";

export interface IIndexWrapperProps {
  index: string;
}

export const IndexWrapper: FC<PropsWithChildren<IIndexWrapperProps>> = props => {
  const { children, index } = props;
  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", index]} />

      <PageHeader message={`pages.${index}.title`} />

      {children}
    </Fragment>
  );
};
