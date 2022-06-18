import { FC, Fragment } from "react";

import { NewErc721 } from "./new-erc721-templates";
import { NewErc998 } from "./new-erc998-templates";
import { NewErc1155 } from "./new-erc1155-tokens";

export const Landing: FC = () => {
  return (
    <Fragment>
      <NewErc721 />
      <NewErc998 />
      <NewErc1155 />
    </Fragment>
  );
};
