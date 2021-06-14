import React, {FC} from "react";
import clsx from "clsx";

import {useStyles} from "./styles";

export const Media: FC<any> = props => {
  const {contentState, block} = props;
  const {url, width, height, alignment, type} = contentState.getEntity(block.getEntityAt(0)).getData();

  const classes = useStyles();

  const htmlTag = () => {
    const componentProps = {
      src: url,
      width: width,
      height: type === "video" ? "auto" : height,
    };

    if (!type || type === "image") {
      return <img {...componentProps} alt="" />;
    }
    if (type === "video") {
      return <video {...componentProps} autoPlay={false} controls />;
    }
    return null;
  };

  return (
    <div
      className={clsx({
        [classes.centered]: alignment === "center",
        [classes.leftAligned]: alignment === "left",
        [classes.rightAligned]: alignment === "right",
      })}
    >
      {htmlTag()}
    </div>
  );
};
