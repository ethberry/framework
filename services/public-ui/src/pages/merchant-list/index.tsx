import { ChangeEvent, FC, Fragment, useState } from "react";
import { useSnackbar } from "notistack";
import { useIntl } from "react-intl";
import { Grid, Pagination } from "@mui/material";
import { parse, stringify } from "qs";
import { useLocation, useNavigate } from "react-router";
import useDeepCompareEffect from "use-deep-compare-effect";

import { ProgressOverlay } from "@gemunion/mui-progress";
import { PageHeader } from "@gemunion/mui-page-header";
import { ApiError, useApi } from "@gemunion/provider-api";
import { IMerchant } from "@gemunion/framework-types";
import { IPaginationResult, ISearchDto } from "@gemunion/types-collection";
import { defaultItemsPerPage } from "@gemunion/constants";

import { MerchantItem } from "./item";

export const MerchantList: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();

  const [isLoading, setIsLoading] = useState(false);
  const [count, setCount] = useState<number>(0);
  const [merchants, setMerchants] = useState<Array<IMerchant>>([]);

  const api = useApi();

  const [data, setData] = useState<ISearchDto>({
    skip: 0,
    take: defaultItemsPerPage,
    query: "",
    ...parse(location.search.substring(1)),
  });

  const updateQS = () => {
    const { skip: _skip, take: _take, ...rest } = data;
    navigate(`/merchants?${stringify(rest)}`);
  };

  const fetchMerchants = async (): Promise<void> => {
    setIsLoading(true);
    return api
      .fetchJson({
        url: "/merchants",
        data,
      })
      .then((json: IPaginationResult<IMerchant>) => {
        setMerchants(json.rows);
        setCount(json.count);
        updateQS();
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

  const handleChangePage = (e: ChangeEvent<unknown>, page: number) => {
    setData({
      ...data,
      skip: (page - 1) * data.take,
    });
  };

  useDeepCompareEffect(() => {
    void fetchMerchants();
  }, [data]);

  return (
    <Fragment>
      <PageHeader message="pages.merchants.title" />

      <ProgressOverlay isLoading={isLoading}>
        <Grid container spacing={2}>
          {merchants.map(merchant => (
            <Grid item lg={4} sm={6} xs={12} key={merchant.id}>
              <MerchantItem merchant={merchant} />
            </Grid>
          ))}
        </Grid>
      </ProgressOverlay>

      <Pagination
        sx={{ mt: 2 }}
        shape="rounded"
        page={data.skip / data.take + 1}
        count={Math.ceil(count / data.take)}
        onChange={handleChangePage}
      />
    </Fragment>
  );
};
