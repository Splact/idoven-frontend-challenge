import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import { useCallback, useEffect, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceArea,
  ResponsiveContainer,
} from "recharts";
import { CategoricalChartState } from "recharts/types/chart/generateCategoricalChart";

export type TZoomableChartProps = {
  data: {
    x: number;
    y: number;
  }[];
  color: string;
};

const DEFAULT_TOP_OFFSET = 10;
const DEFAULT_BOTTOM_OFFSET = 10;

const ZoomableChart = ({ data, color }: TZoomableChartProps) => {
  const [
    { left, right, zoomAreaLeft, zoomAreaRight, top, bottom, animation },
    setState,
  ] = useState<{
    left: string | number;
    right: string | number;
    zoomAreaLeft?: number;
    zoomAreaRight?: number;
    top: string | number;
    bottom: string | number;
    animation: boolean;
  }>({
    left: "dataMin",
    right: "dataMax",
    top: `dataMax+${DEFAULT_TOP_OFFSET}`,
    bottom: `dataMin-${DEFAULT_BOTTOM_OFFSET}`,
    animation: true,
  });

  useEffect(() => {
    setState((state) => ({
      ...state,
      left: "dataMin",
      right: "dataMax",
      zoomAreaLeft: undefined,
      zoomAreaRight: undefined,
      top: `dataMax+${DEFAULT_TOP_OFFSET}`,
      bottom: `dataMin-${DEFAULT_BOTTOM_OFFSET}`,
    }));
  }, [data]);

  const getAxisYDomain = useCallback(
    (from: number, to: number, offset: number) => {
      // get data visible in zoomed chart
      const zoomAreaData = data.slice(from, to + 1);

      let bottom = zoomAreaData[0].y;
      let top = bottom;

      zoomAreaData.forEach(({ y }) => {
        if (y > top) {
          top = y;
        }
        if (y < bottom) {
          bottom = y;
        }
      });

      return [bottom - offset, top + offset];
    },
    [data]
  );

  const handleMouseDown = useCallback((e: CategoricalChartState) => {
    setState((state) => ({
      ...state,
      zoomAreaLeft: e?.activeTooltipIndex,
    }));
  }, []);
  const handleMouseMove = useCallback((e: CategoricalChartState) => {
    setState((state) => ({
      ...state,
      zoomAreaRight: state.zoomAreaLeft
        ? e?.activeTooltipIndex
        : state.zoomAreaRight,
    }));
  }, []);
  const handleMouseUp = useCallback(() => {
    if (
      zoomAreaLeft === zoomAreaRight ||
      zoomAreaLeft === undefined ||
      zoomAreaRight === undefined
    ) {
      setState((state) => ({
        ...state,
        zoomAreaLeft: undefined,
        zoomAreaRight: undefined,
      }));

      return;
    }

    // xAxis domain
    const invertZoomLimits = zoomAreaLeft > zoomAreaRight;

    const leftIndex = invertZoomLimits ? zoomAreaRight : zoomAreaLeft;
    const rightIndex = invertZoomLimits ? zoomAreaLeft : zoomAreaRight;

    // yAxis domain
    const [bottom, top] = getAxisYDomain(leftIndex, rightIndex, 1);

    setState((state) => ({
      ...state,
      zoomAreaLeft: undefined,
      zoomAreaRight: undefined,
      left: data[leftIndex].x,
      right: data[rightIndex].x,
      bottom,
      top,
    }));
  }, [data, zoomAreaLeft, zoomAreaRight]);
  const handleZoomOutClick = useCallback(() => {
    setState((state) => ({
      ...state,
      zoomAreaLeft: undefined,
      zoomAreaRight: undefined,
      left: "dataMin",
      right: "dataMax",
      top: `dataMax+${DEFAULT_TOP_OFFSET}`,
      bottom: `dataMin-${DEFAULT_BOTTOM_OFFSET}`,
    }));
  }, []);

  return (
    <Box
      position="relative"
      width="100%"
      height={400}
      sx={{ userSelect: "none" }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          height={400}
          data={data}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            allowDataOverflow
            dataKey="x"
            domain={[left, right]}
            type="number"
          />
          <YAxis
            allowDataOverflow
            domain={[bottom, top]}
            type="number"
            yAxisId="1"
          />

          <Tooltip />

          <Line
            yAxisId="1"
            type="linear"
            dataKey="y"
            stroke={color}
            animationDuration={300}
            dot={false}
          />

          {zoomAreaLeft && zoomAreaRight ? (
            <ReferenceArea
              yAxisId="1"
              x1={data[zoomAreaLeft].x}
              x2={data[zoomAreaRight].x}
              strokeOpacity={0.25}
            />
          ) : null}
        </LineChart>
      </ResponsiveContainer>

      <IconButton
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          zIndex: 1,
        }}
        onClick={handleZoomOutClick}
      >
        <ZoomOutIcon />
      </IconButton>
    </Box>
  );
};

export default ZoomableChart;
