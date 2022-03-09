import { FC, useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Button, MobileStepper } from "@mui/material";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { useSnackbar } from "notistack";

import { ProgressOverlay, Spinner } from "@gemunion/mui-progress";
import { ApiError, useApi } from "@gemunion/provider-api";
import { IPromo } from "@gemunion/framework-types";
import { IPaginationResult } from "@gemunion/types-collection";

import { useStyles } from "./styles";

export const PromoCarousel: FC = () => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();

  const [isLoading, setIsLoading] = useState(false);
  const [promos, setPromos] = useState<Array<IPromo>>([]);

  const api = useApi();

  const handleNext = () => {
    setActiveStep(step => step + 1);
  };

  const handleBack = () => {
    setActiveStep(step => step - 1);
  };

  const fetchPromos = async (): Promise<void> => {
    setIsLoading(true);
    return api
      .fetchJson({
        url: "/promo",
      })
      .then((json: IPaginationResult<IPromo>) => {
        setPromos(json.rows);
      })
      .catch((e: ApiError) => {
        if (e.status) {
          enqueueSnackbar(formatMessage({ id: `snackbar.${e.message}` }), { variant: "error" });
        } else {
          console.error(e);
          enqueueSnackbar(formatMessage({ id: "snackbar.error" }), { variant: "error" });
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    void fetchPromos();
  }, []);

  if (!promos.length) {
    return <Spinner />;
  }

  return (
    <div className={classes.root}>
      <ProgressOverlay isLoading={isLoading}>
        <div className={classes.img} style={{ backgroundImage: `url(${promos[activeStep].imageUrl})` }} />
        <MobileStepper
          className={classes.stepper}
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
      </ProgressOverlay>
    </div>
  );
};
