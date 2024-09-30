import React from "react";
import { Typography } from "@mui/material";
import { Stack } from "@mui/system";

interface SnackbarMessageProps {
  title: string;
  subtitle?: string;
}

export const SnackbarMessage: React.FC<SnackbarMessageProps> = ({
  title,
  subtitle,
}) => {
  return (
    <Stack direction="column">
      {title && (
        <Typography
          variant="h6"
          paddingBottom={0}
          marginBottom={0}
        >
          {title}
        </Typography>
      )}
      {subtitle && (
        <Typography variant="caption" gutterBottom>
          {subtitle}
        </Typography>
      )}
    </Stack>
  );
};
