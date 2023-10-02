import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

import useECG from "../../hooks/useECG";
import { Box, Container } from "@mui/material";
import { ECG_DEFAULT_TIME_RANGE } from "../../constants";
import ECGCharts from "../ECGCharts";

const ECGView = () => {
  const { file, setFile, setTimeRange } = useECG();

  const onDrop = useCallback<(acceptedFiles: File[]) => void>(
    (acceptedFiles) => {
      if (acceptedFiles.length === 0) {
        return;
      }

      setFile(acceptedFiles[0]);
      setTimeRange(ECG_DEFAULT_TIME_RANGE);
    },
    [setFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "text/csv": [".csv", ".txt"],
    },
    multiple: false,
    onDrop,
  });

  return (
    <Container maxWidth="lg" sx={{ mb: 4, mt: 4 }}>
      <Box
        {...getRootProps()}
        sx={{
          display: !!file ? "none" : "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "calc(100vh - 64px - 64px)",
          p: 2,

          border: "1px dashed grey",
        }}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the ECG file here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </Box>

      {!!file ? <ECGCharts /> : null}
    </Container>
  );
};

export default ECGView;
