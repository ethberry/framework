import { FC, Fragment } from "react";

import { NewErc721 } from "./new-templates";
import { NewErc1155 } from "./new-tokens";

export const Landing: FC = () => {
  return (
    <Fragment>
      <NewErc721 />
      <NewErc1155 />
    </Fragment>
  );
};
