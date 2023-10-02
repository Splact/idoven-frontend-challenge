import {
  Stack,
  Pagination,
  Typography,
  Box,
  ButtonGroup,
  Button,
} from "@mui/material";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { ChangeEvent, useMemo, useState } from "react";

import useECG from "../../hooks/useECG";
import { ECG_COLORS, ECG_PAGE_SIZE } from "../../constants";
import ZoomableChart from "../ZoomableChart";

const ECGCharts = () => {
  const { readings, timeRange, setTimeRange } = useECG();

  const [activeSignalIndex, setActiveSignalIndex] = useState<number>(0);
  const handleSignalChange = (_: ChangeEvent<unknown>, value: number) => {
    setActiveSignalIndex(value - 1);
  };

  const handlePreviousReadings = () => {
    const startTime = Math.max(timeRange[0] - ECG_PAGE_SIZE, 0);
    const endTime = startTime + ECG_PAGE_SIZE;

    setTimeRange([startTime, endTime]);
  };
  const handleNextReadings = () => {
    const startTime = timeRange[1];
    const endTime = startTime + ECG_PAGE_SIZE;

    setTimeRange([startTime, endTime]);
  };

  // map the readings to the chart data {x, y}
  const data = useMemo(
    () =>
      readings.map(({ time, signals }) => ({
        x: time,
        y: signals[activeSignalIndex] ?? 0,
      })),
    [readings, activeSignalIndex]
  );

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="subtitle1">
          Signal {activeSignalIndex + 1}
        </Typography>

        <Pagination count={5} onChange={handleSignalChange} />
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <ZoomableChart data={data} color={ECG_COLORS[activeSignalIndex]} />
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mt: 4,
        }}
      >
        <ButtonGroup
          variant="contained"
          aria-label="outlined primary button group"
        >
          <Button
            startIcon={<KeyboardDoubleArrowLeftIcon />}
            onClick={handlePreviousReadings}
            disabled={timeRange[0] <= 0}
          >
            Previous readings
          </Button>
          <Button
            endIcon={<KeyboardDoubleArrowRightIcon />}
            onClick={handleNextReadings}
          >
            Next readings
          </Button>
        </ButtonGroup>
      </Box>
    </>
  );
};

export default ECGCharts;
