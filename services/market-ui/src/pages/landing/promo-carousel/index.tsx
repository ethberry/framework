import { FC, useCallback, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { Button } from "@mui/material";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { useNavigate } from "react-router";

import type { IProductPromo } from "@framework/types";
import { ProgressOverlay } from "@gemunion/mui-page-layout";
import { useApiCall } from "@gemunion/react-hooks";
import { IPaginationResult } from "@gemunion/types-collection";

import { Root, StyledImage, StyledMobileStepper } from "./styled";

export const PromoCarousel: FC = () => {
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);
  const [promos, setPromos] = useState<Array<IProductPromo>>([]);

  const handleNext = () => {
    setActiveStep(step => step + 1);
  };

  const handleBack = () => {
    setActiveStep(step => step - 1);
  };

  const handleClick = useCallback(() => {
    navigate(`/ecommerce/products/${promos[activeStep].product!.id}`);
  }, [activeStep, promos]);

  const { fn, isLoading } = useApiCall(
    async api => {
      return api.fetchJson({
        url: "/promos",
      });
    },
    { success: false, error: false },
  );

  const fetchPromos = (): Promise<void> =>
    fn()
      .then((json: IPaginationResult<IProductPromo>) => {
        setPromos(json.rows);
      })
      .catch(e => {
        console.error(e);
      });

  useEffect(() => {
    void fetchPromos();
  }, []);

  return (
    <ProgressOverlay isLoading={isLoading}>
      <Root>
        <StyledImage onClick={handleClick} imageUrl={promos[activeStep]?.imageUrl} />
        <StyledMobileStepper
          steps={promos.length}
          position="static"
          variant="dots"
          activeStep={activeStep}
          backButton={
            <Button size="small" onClick={handleBack} disabled={activeStep === 0} startIcon={<KeyboardArrowLeft />}>
              <FormattedMessage id="form.buttons.back" />
            </Button>
          }
          nextButton={
            <Button
              size="small"
              onClick={handleNext}
              disabled={activeStep === promos.length - 1}
              endIcon={<KeyboardArrowRight />}
            >
              <FormattedMessage id="form.buttons.next" />
            </Button>
          }
        />
      </Root>
    </ProgressOverlay>
  );
};
