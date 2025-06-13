import { DateTimePicker } from "@mui/x-date-pickers";
import { JulianDate } from "cesium";
import { useEffect, useState } from "react";
import { useCesium } from "resium";
import dayjs, { Dayjs } from "dayjs";
import { Grid } from "@mui/material";

export default function TimePicker() {
  const { viewer } = useCesium();

  const [dateTime, setDateTime] = useState<Dayjs | undefined>(undefined);

  useEffect(() => {
    if (!viewer || dateTime !== undefined) return;

    const date = dayjs(JulianDate.toDate(viewer.clock.currentTime));

    setDateTime(dayjs(date));
  }, [dateTime, viewer]);

  useEffect(() => {
    if (dateTime === undefined || !viewer) return;

    viewer.clock.currentTime = JulianDate.fromDate(dateTime.toDate());
  }, [dateTime, viewer]);

  return (
    <Grid
      container
      padding={2}
      borderRadius="0 0 8px 8px"
      sx={{
        position: "absolute",
        top: 0,
        left: "50%",
        transform: "translateX(-50%)",
        border: "none",
        background: "white",
      }}
    >
      <DateTimePicker
        label="Time"
        value={dateTime ?? dayjs()}
        onChange={(date) => {
          if (!date) return;

          setDateTime(date);
        }}
        formatDensity="dense"
      />
    </Grid>
  );
}
