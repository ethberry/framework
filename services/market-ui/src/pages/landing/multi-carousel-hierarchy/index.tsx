import { ComponentType, FC } from "react";
import { Theme, useMediaQuery, useTheme } from "@mui/material";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import type { ITemplate } from "@framework/types";

import { MultiCarouselButtonGroup } from "./button-group";
import { Root } from "./styled";

declare interface IMultiCarouselHierarchyProps {
  templates: Array<ITemplate>;
  component: ComponentType<{ template: ITemplate }>;
}

export enum IResolutions {
  DESKTOP = "DESKTOP",
  TABLET = "TABLET",
  MOBILE = "MOBILE",
}

export const MultiCarouselHierarchy: FC<IMultiCarouselHierarchyProps> = props => {
  const { templates, component: Component } = props;

  const there = useTheme();

  const responsive = {
    [IResolutions.DESKTOP]: {
      breakpoint: {
        max: 3000,
        min: there.breakpoints.values.md,
      },
      items: 3,
    },
    [IResolutions.TABLET]: {
      breakpoint: {
        max: there.breakpoints.values.md,
        min: there.breakpoints.values.sm,
      },
      items: 2,
    },
    [IResolutions.MOBILE]: {
      breakpoint: {
        max: there.breakpoints.values.sm,
        min: 0,
      },
      items: 1,
    },
  };

  const isSmallScreen = useMediaQuery<Theme>(theme => theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery<Theme>(theme => theme.breakpoints.down("md"));

  const deviceType = isSmallScreen ? IResolutions.MOBILE : isMediumScreen ? IResolutions.TABLET : IResolutions.DESKTOP;

  return (
    <Root>
      <Carousel
        ssr
        deviceType={deviceType}
        className={"MultiCarouselHierarchy-Container"}
        itemClass={"MultiCarouselHierarchy-Item"}
        responsive={responsive}
        arrows={false}
        renderButtonGroupOutside={true}
        customButtonGroup={<MultiCarouselButtonGroup />}
        infinite
      >
        {templates.map(template => (
          <Component key={template.id} template={template} />
        ))}
      </Carousel>
    </Root>
  );
};
