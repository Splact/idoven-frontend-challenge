import Papa from "papaparse";
import { useContext, useEffect, useRef } from "react";

import ECGDataContext from "../contexts/ECGDataContext";
import { TECGDataSignal, TECGReading } from "../types";

const useECG = () => {
  const {
    file,
    isLoading,
    readings,
    timeRange,
    setFile,
    setReadings,
    setIsLoading,
    setTimeRange,
  } = useContext(ECGDataContext);
  const [minTime, maxTime] = timeRange;
  const streamingInfo = useRef<
    | {
        file?: File;
        minTime: number;
        maxTime: number;
        collectedRows: TECGReading[];
      }
    | undefined
  >();

  useEffect(() => {
    // if there is already a worker running with the same time range and file
    // then don't start a new one
    if (
      streamingInfo.current &&
      streamingInfo.current.minTime === minTime &&
      streamingInfo.current.maxTime === maxTime &&
      streamingInfo.current.file === file
    ) {
      return;
    }

    // save current time range
    streamingInfo.current = {
      // this may be not exauhstive, but it's good enough for this example
      file,
      minTime,
      maxTime,
      collectedRows: [],
    };

    if (!file) {
      // no file selected, nothing to do
      return;
    }

    if (maxTime - minTime <= 0) {
      // invalid time range, nothing to do
      return;
    }

    console.log(
      `Parsing CSV file "${file.name}" for range [${minTime}, ${maxTime}]`
    );

    setIsLoading(true);

    Papa.parse<
      [
        number,
        number,
        TECGDataSignal,
        TECGDataSignal,
        TECGDataSignal,
        TECGDataSignal
      ]
    >(file, {
      // use a worker to parse the data
      worker: true,
      // convert each value to a number
      dynamicTyping: true,
      // skip the header row
      header: false,
      // since the example input doesn't have quotes around each field we can use
      // fastMode to speed up parsing
      fastMode: true,
      // while streaming chunk the input into smaller pieces (64kb)
      chunkSize: 64000,
      // enable streaming so that we can get the results as the file is parsed
      step: (results, parser) => {
        if (
          !streamingInfo.current ||
          streamingInfo.current.minTime !== minTime ||
          streamingInfo.current.maxTime !== maxTime ||
          streamingInfo.current.file !== file
        ) {
          // this worker is running on old data, not needed anymore
          parser.abort();

          return;
        }

        const [time, signal1, signal2, signal3, signal4, signal5] =
          results.data;

        if (typeof time !== "number") {
          // this row is not valid, skip it
          return;
        }

        if (time < minTime) {
          // this row is behind the time range, skip it
          return;
        }

        if (time > maxTime) {
          // this row is ahead of the time range, stop parsing
          parser.abort();

          return;
        }

        // add this row to the collected rows
        streamingInfo.current.collectedRows.push({
          time,
          signals: [signal1, signal2, signal3, signal4, signal5],
        });
      },
      complete: () => {
        console.log(
          "CSV parsing complete",
          streamingInfo.current?.collectedRows
        );

        setReadings([...(streamingInfo.current?.collectedRows ?? [])]);
        setIsLoading(false);
      },
    });
  }, [file, minTime, maxTime]);

  // this is the public API of this hook
  return {
    file,
    timeRange,
    isLoading,
    readings,
    setFile,
    setTimeRange,
  };
};

export default useECG;
