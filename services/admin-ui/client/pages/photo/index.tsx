import React, {FC, useContext, useEffect, useState} from "react";
import {useSnackbar} from "notistack";
import {useIntl} from "react-intl";
import {
  Avatar,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
} from "@material-ui/core";
import {Clear, Done} from "@material-ui/icons";

import {ProgressOverlay} from "@trejgun/material-ui-progress";
import {PageHeader} from "@trejgun/material-ui-page-header";
import {ApiContext, ApiError} from "@trejgun/provider-api";
import {IPhoto, PhotoStatus} from "@trejgun/solo-types";
import {IPaginationResult} from "@trejgun/types-collection";

import {Breadcrumbs} from "../../components/common/breadcrumbs";

export const Photo: FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [photos, setPhotos] = useState<Array<IPhoto>>([]);
  const {enqueueSnackbar} = useSnackbar();
  const {formatMessage} = useIntl();

  const api = useContext(ApiContext);

  const fetchPhotosByQuery = async (): Promise<void> => {
    return api
      .fetchJson({
        url: "/photos",
      })
      .then((json: IPaginationResult<IPhoto>) => {
        setPhotos(json.list);
      });
  };

  const fetchPhotos = async (): Promise<void> => {
    setIsLoading(true);
    return fetchPhotosByQuery()
      .catch((e: ApiError) => {
        if (e.status) {
          enqueueSnackbar(formatMessage({id: `snackbar.${e.message}`}), {variant: "error"});
        } else {
          console.error(e);
          enqueueSnackbar(formatMessage({id: "snackbar.error"}), {variant: "error"});
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
            enqueueSnackbar(formatMessage({id: `snackbar.${e.message}`}), {variant: "error"});
          } else {
            console.error(e);
            enqueueSnackbar(formatMessage({id: "snackbar.error"}), {variant: "error"});
          }
        });
    };
  };

  useEffect(() => {
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
