import React, { useEffect, useState } from "react";
import { Box, useTheme } from "@mui/material";
import { ResponsiveLine } from "@nivo/line";
import RdvService from "../../services/rdv";

const months = [
  "January", "February", "March", 
  "April", "May", "June", 
  "July", "August", "September", 
  "October", "November", "December"
];

const Line = ({ isDashboard = false, style }) => {
  const theme = useTheme();
  const [stats, setStats] = useState([])

  useEffect(() => {
    const fetchStats = async () => {
      const { data: { data } } = await RdvService.getStatsByMntPaye();

      const statsShaped = data.map(ele => ({
        id: ele._id.year,
        color: "hsl(210, 70%, 50%)",
        data: data.map(ele2 => ({
          x: months[ele2._id.month - 1],
          y: ele2.totalAmount['$numberDecimal']
        }))
      }))
      console.log("DATA : ", statsShaped)

      setStats(statsShaped)
    }

    fetchStats();

  }, [])

  return (
    <Box sx={{ height: isDashboard ? "340px" : "75vh", width: isDashboard ? "100%" : "auto" }}>
      <ResponsiveLine
        theme={{
          textColor: theme.palette.text.primary,
          fontSize: 11,
          axis: {
            domain: {
              line: {
                stroke: theme.palette.divider,
                strokeWidth: 1,
              },
            },
            legend: {
              text: {
                fontSize: 12,
                fill: theme.palette.text.primary,
              },
            },
            ticks: {
              line: {
                stroke: theme.palette.divider,
                strokeWidth: 1,
              },
              text: {
                fontSize: 11,
                fill: theme.palette.text.secondary,
              },
            },
          },
          grid: {
            line: {
              stroke: theme.palette.divider,
              strokeWidth: 0,
            },
          },
          legends: {
            title: {
              text: {
                fontSize: 11,
                fill: theme.palette.text.primary,
              },
            },
            text: {
              fontSize: 11,
              fill: theme.palette.text.primary,
            },
            ticks: {
              line: {},
              text: {
                fontSize: 10,
                fill: theme.palette.text.primary,
              },
            },
          },
          annotations: {
            text: {
              fontSize: 13,
              fill: theme.palette.text.primary,
              outlineWidth: 2,
              outlineColor: "#ffffff",
              outlineOpacity: 1,
            },
            link: {
              stroke: "#000000",
              strokeWidth: 1,
              outlineWidth: 2,
              outlineColor: "#ffffff",
              outlineOpacity: 1,
            },
            outline: {
              stroke: "#000000",
              strokeWidth: 2,
              outlineWidth: 2,
              outlineColor: "#ffffff",
              outlineOpacity: 1,
            },
            symbol: {
              fill: "#000000",
              outlineWidth: 2,
              outlineColor: "#ffffff",
              outlineOpacity: 1,
            },
          },
          tooltip: {
            container: {
              background: theme.palette.background.default,
              color: theme.palette.text.primary,
              fontSize: 12,
            },
            basic: {},
            chip: {},
            table: {},
            tableCell: {},
            tableCellValue: {},
          },
        }}
        data={stats}
        curve="catmullRom"
        margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
        xScale={{ type: "point" }}
        yScale={{
          type: "linear",
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: isDashboard ? null : "Mois",
          legendOffset: 36,
          legendPosition: "middle",
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: isDashboard ? null : "Argent (DT)",
          legendOffset: -40,
          legendPosition: "middle",
        }}
        pointSize={10}
        pointColor={{ theme: "background" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor" }}
        pointLabelYOffset={-12}
        useMesh={true}
      />
    </Box>
  );
};

export default Line;
