"use client";

import { Link } from "@/server/i18n/routing";
import { trpc } from "@/server/trpc/client";
import { ArrowRightOutlined } from "@mui/icons-material";
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator
} from "@mui/lab";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid2,
  Grid2Props,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useFormatter, useTranslations } from "next-intl";

const cardProps: Grid2Props<typeof Card> = {
  size: {
    xl: 6,
    lg: 6,
    md: 6,
    sm: 12,
    xs: 12,
  },
  component: Card,
  padding: 3,
  elevation: 2,
  borderRadius: 1,
};

export default function MyAreaPage() {
  const session = useSession();

  const t = useTranslations();

  const formatter = useFormatter();

  const { data: { updatedAt } = { updatedAt: new Date() } } =
    trpc.myAreaRouter.getLastLogin.useQuery();

  return (
    <Grid2 container spacing={4} flexDirection="column">
      <Typography variant="h4">{t("index.my-area")}</Typography>
      <Grid2 container spacing={2}>
        <Grid2 {...cardProps}>
          <CardHeader
            title={t("index.welcoming-text", { name: session.data?.user.name })}
          />
          <CardContent>
            {t("index.last-logged-in-message", {
              date: formatter.dateTime(updatedAt, {
                dateStyle: "long",
                timeStyle: "medium",
              }),
            })}
          </CardContent>
          <CardActions>
            <Button
              variant="text"
              endIcon={<ArrowRightOutlined />}
              href="/profile"
              color="secondary"
              LinkComponent={Link}
            >
              {t("index.show-profile")}
            </Button>
          </CardActions>
        </Grid2>
        <Grid2 {...cardProps}>
          <CardHeader title={t("index.project-management")} />
          <CardContent></CardContent>
          <CardActions>
            <Button
              variant="text"
              endIcon={<ArrowRightOutlined />}
              href="/project-management"
              color="secondary"
              LinkComponent={Link}
            >
              {t("index.manage-projects")}
            </Button>
          </CardActions>
        </Grid2>
        <Grid2 {...cardProps}>
          <CardHeader title={t("index.collaboration")} />
          <CardContent>
            <span>
              {t("index.today")}{" "}
              {formatter.dateTime(dayjs().toDate(), { dateStyle: "medium" })}
            </span>
            <Timeline>
              <TimelineItem>
                <TimelineOppositeContent color="textSecondary">
                  <span style={{ whiteSpace: "nowrap" }}>
                    {formatter.dateTimeRange(
                      dayjs().hour(12).minute(30).toDate(),
                      dayjs().hour(13).minute(30).toDate(),
                      {
                        timeStyle: "short",
                      }
                    )}
                  </span>
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>Bauphase 1</TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineOppositeContent noWrap color="textSecondary">
                  {formatter.dateTimeRange(
                    dayjs().hour(15).minute(30).toDate(),
                    dayjs().hour(16).minute(0).toDate(),
                    {
                      timeStyle: "short",
                    }
                  )}
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot />
                </TimelineSeparator>
                <TimelineContent>Bauphase 2</TimelineContent>
              </TimelineItem>
            </Timeline>
          </CardContent>
          <CardActions>
            <Button
              variant="text"
              endIcon={<ArrowRightOutlined />}
              href="/collaboration"
              color="secondary"
              LinkComponent={Link}
            >
              {t("index.show-collaboration")}
            </Button>
          </CardActions>
        </Grid2>
        <Grid2 {...cardProps}>
          <CardHeader title={t("index.administration")} />
          <CardContent></CardContent>
          <CardActions>
            <Button
              variant="text"
              endIcon={<ArrowRightOutlined />}
              href="/administration"
              color="secondary"
              LinkComponent={Link}
            >
              {t("index.show-administration")}
            </Button>
          </CardActions>
        </Grid2>
      </Grid2>
    </Grid2>
  );
}
