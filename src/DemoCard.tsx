import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { Demo } from "./types";

const DemoCard = ({ demo }: { demo: Demo }) => {
  return (
    <Card
      sx={{
        maxWidth: 320,
        margin: "1rem auto",
        padding: 2,
        borderRadius: 2,
        boxShadow: 3,
        textAlign: "center",
      }}
    >
      <CardContent>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          {demo.title}
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          {demo.description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default DemoCard;
