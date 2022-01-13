import { FC, useContext, useState } from "react";
import { useSnackbar } from "notistack";
import { useIntl } from "react-intl";
import {
  Avatar,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
} from "@mui/material";
import { Clear, Done } from "@mui/icons-material";
import useDeepCompareEffect from "use-deep-compare-effect";

import { ProgressOverlay } from "@gemunion/mui-progress";
import { PageHeader } from "@gemunion/mui-page-header";
import { ApiContext, ApiError } from "@gemunion/provider-api";
import { IPhoto, PhotoStatus } from "@gemunion/framework-types";
import { IPaginationResult } from "@gemunion/types-collection";
import { Breadcrumbs } from "@gemunion/mui-breadcrumbs";

export const Photo: FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [photos, setPhotos] = useState<Array<IPhoto>>([]);
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();

  const api = useContext(ApiContext);

  const fetchPhotosByQuery = async (): Promise<void> => {
    return api
      .fetchJson({
        url: "/photos",
      })
      .then((json: IPaginationResult<IPhoto>) => {
        setPhotos(json.rows);
      });
  };

  const fetchPhotos = async (): Promise<void> => {
    setIsLoading(true);
    return fetchPhotosByQuery()
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

  const handleClick = (photo: IPhoto, newStatus: PhotoStatus) => {
    return () => {
      return api
        .fetchJson({
          url: `/photos/${photo.id}`,
          method: "PUT",
          data: {
            photoStatus: newStatus,
          },
        })
        .then(() => {
          return fetchPhotos();
        })
        .catch((e: ApiError) => {
          if (e.status) {
            enqueueSnackbar(formatMessage({ id: `snackbar.${e.message}` }), { variant: "error" });
          } else {
            console.error(e);
            enqueueSnackbar(formatMessage({ id: "snackbar.error" }), { variant: "error" });
          }
        });
    };
  };

  useDeepCompareEffect(() => {
    void fetchPhotos();
  }, []);

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "photos"]} />

      <PageHeader message="pages.photos.title" />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {photos.map(photo => (
            <ListItem key={photo.id}>
              <ListItemAvatar>
                <Avatar alt={photo.title} src={photo.imageUrl} />
              </ListItemAvatar>
              <ListItemText primary={photo.title} />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="approve" onClick={handleClick(photo, PhotoStatus.APPROVED)}>
                  <Done />
                </IconButton>
                <IconButton edge="end" aria-label="delete" onClick={handleClick(photo, PhotoStatus.DECLINED)}>
                  <Clear />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </ProgressOverlay>
    </Grid>
  );
};
