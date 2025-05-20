"use client";

import { Link } from "@/server/i18n/routing";
import { ArrowRightOutlined, CopyAll, MoreVert } from "@mui/icons-material";
import {
  Avatar,
  AvatarGroup,
  Grid2,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  TextField,
  Typography
} from "@mui/material";
import dayjs from "dayjs";
import { useFormatter, useNow, useTranslations } from "next-intl";
import { useSnackbar } from "notistack";

function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  };
}

export default function CollaborationPage() {
  const t = useTranslations();

  const formatter = useFormatter();

  const now = useNow({
    updateInterval: 1000 * 10,
  });

  const { enqueueSnackbar } = useSnackbar();

  const items = [
    {
      name: "Bauphase 1",
      startDate: dayjs().toDate(),
      endDate: dayjs().add(1, "hour").toDate(),
      key: "a",
      role: "Gast",
      code: "ABC-DEF-123-456",
    },
    {
      name: "Bauphase 2",
      startDate: dayjs().subtract(30, "minute").toDate(),
      endDate: dayjs().subtract(0, "minute").toDate(),
      key: "b",
      role: "Moderator",
      code: "ABC-DEF-123-456",
    },
  ];

  return (
    <Grid2 container flexDirection="column">
      <Typography marginBottom={4} variant="h4">
        {t("collaboration.collaboration")}
      </Typography>
      <Paper elevation={2}>
        <List disablePadding>
          {items.map((item) => (
            <ListItem
              secondaryAction={
                <IconButton>
                  <MoreVert />
                </IconButton>
              }
              divider
              key={item.key}
            >
              <ListItemText
                primary={item.name}
                secondary={formatter.dateTimeRange(
                  item.startDate,
                  item.endDate,
                  {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}
              />
              <ListItemText>
                {formatter.relativeTime(item.startDate, {
                  style: "long",
                  now,
                })}
              </ListItemText>
              <ListItemAvatar>
                <AvatarGroup
                  renderSurplus={(surplus) => (
                    <>
                      +
                      {formatter.number(surplus, {
                        compactDisplay: "short",
                        maximumSignificantDigits: 1,
                      })}
                    </>
                  )}
                  total={12}
                >
                  <Avatar {...stringAvatar("Anton Admin")} />
                  <Avatar {...stringAvatar("Travis Howard")} />
                  <Avatar {...stringAvatar("Agnes Walker")} />
                </AvatarGroup>
              </ListItemAvatar>
              <ListItemText>{item.role}</ListItemText>
              <ListItemText>
                <TextField
                  label={t("collaboration.code")}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => {
                              window.navigator.clipboard.writeText(item.code);
                              enqueueSnackbar({
                                variant: "success",
                                message: t(
                                  "collaboration.copied-to-clipboard-success"
                                ),
                              });
                            }}
                          >
                            <CopyAll />
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                  value={item.code}
                  disabled
                />
              </ListItemText>
              <ListItemButton component={Link} href="#">
                <ListItemText primary={t("collaboration.to-project")} />
                <ListItemIcon>
                  <ArrowRightOutlined />
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Grid2>
  );
}
