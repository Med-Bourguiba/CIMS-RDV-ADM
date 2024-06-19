import React, { useEffect, useState } from "react";
import { ResponsiveBar } from "@nivo/bar";
import { Box, useTheme } from "@mui/material";
import RdvService from "../../services/rdv";

const Bar = ({ isDashboard = false }) => {
  const theme = useTheme();
  const [stats, setStats] = useState([]);


  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: { data } } = await RdvService.getStatsByServiceAndMed();

        const dataShaped = data.map(service => ({
          service: service.service,
          ...service.medecins.reduce((acc, medecin) => {
            acc[`Dr. ${medecin.medecin}`] = medecin.count;
            return acc;
          }, {})
        }));

        setStats(dataShaped);
      } catch (error) {
        console.log("ERROR", error.message);
      }
    };

    fetchStats();
  }, []);


  return (
    <Box sx={{ height: isDashboard ? "300px" : "75vh", width: "98%" }}>
      <ResponsiveBar
        data={stats}
        keys={Object.keys(stats.reduce((acc, curr) => ({ ...acc, ...curr }), {})).filter(key => key !== 'service')}
        indexBy="service"
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
              strokeWidth: 1,
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
        margin={{ top: 50, right: 185, bottom: 50, left: 60 }} 
        padding={0.3}
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
        colors={{ scheme: "nivo" }}
        borderColor={{
          from: "color",
          modifiers: [["darker", 1.6]],
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: isDashboard ? null : "Service",
          legendPosition: "middle",
          legendOffset: 35,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: isDashboard ? null : "Nombre Consultation",
          legendPosition: "middle",
          legendOffset: -55,
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{
          from: "color",
          modifiers: [["darker", 1.6]],
        }}
        legends={[
          {
            dataFrom: "keys",
            anchor: "bottom-right",
            direction: "column",
            justify: false,
            translateX: 200, // Augmenté la translation à droite
            translateY: 0,
            itemsSpacing: 8, // Augmenté l'espacement entre les éléments
            itemWidth: 180, // Augmenté la largeur des éléments
            itemHeight: 20,
            itemDirection: "left-to-right",
            itemOpacity: 0.85,
            symbolSize: 20,
            effects: [
              {
                on: "hover",
                style: {
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
        role="application"
        ariaLabel="Nivo bar chart demo"
        barAriaLabel={function (e) {
          return (
            e.id + ": " + e.formattedValue + " in service: " + e.indexValue
          );
        }}
      />
    </Box>
  );
};

export default Bar;
