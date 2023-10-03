import { FC } from "react";
import { Avatar, Grid, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import { Clear, Done } from "@mui/icons-material";

import { ListAction, ListActions } from "@framework/mui-lists";
import type { IPhoto } from "@framework/types";
import { PhotoStatus } from "@framework/types";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useApiCall, useCollection } from "@gemunion/react-hooks";

export const Photo: FC = () => {
  const { rows, fetch, isLoading } = useCollection<IPhoto>({
    baseUrl: "/ecommerce/photos",
    empty: {
      title: "",
      imageUrl: "",
      photoStatus: PhotoStatus.NEW,
      priority: 0,
      productId: 1,
      productItemId: null,
    },
  });

  const { fn: handleChangeStatusApi } = useApiCall(
    (api, values: { photo: IPhoto; newStatus: PhotoStatus }) => {
      const { photo, newStatus } = values;
      return api
        .fetchJson({
          url: `/ecommerce/photos/${photo.id}`,
          method: "PUT",
          data: {
            photoStatus: newStatus,
          },
        })
        .then(() => fetch());
    },
    { success: false },
  );

  const handleChangeStatus = (photo: IPhoto, newStatus: PhotoStatus) => () =>
    handleChangeStatusApi(void 0, { photo, newStatus });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "ecommerce", "photos"]} />

      <PageHeader message="pages.photos.title" />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map(photo => (
            <ListItem key={photo.id}>
              <ListItemAvatar>
                <Avatar alt={photo.title} src={photo.imageUrl} />
              </ListItemAvatar>
              <ListItemText primary={photo.title} />
              <ListActions>
                <ListAction
                  onClick={handleChangeStatus(photo, PhotoStatus.APPROVED)}
                  message="form.buttons.approve"
                  icon={Done}
                />
                <ListAction
                  onClick={handleChangeStatus(photo, PhotoStatus.DECLINED)}
                  message="form.buttons.delete"
                  icon={Clear}
                />
              </ListActions>
            </ListItem>
          ))}
        </List>
      </ProgressOverlay>
    </Grid>
  );
};
