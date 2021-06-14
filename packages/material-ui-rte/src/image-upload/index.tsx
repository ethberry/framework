import React, {Fragment, FC} from "react";

export const ImageUpload: FC<any> = props => {
  const {blockProps} = props;

  return (
    <Fragment>
      {blockProps.urls.map((url: string, i: number) => (
        <img key={i} src={url} alt="" />
      ))}
    </Fragment>
  );
};
