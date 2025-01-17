import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import { Chart } from 'src/components/chart';
import CardHeader from "@mui/material/CardHeader";
import React, {useEffect, useRef} from "react";
import {RouterLink} from "../../../components/router-link";
import SvgIcon from "@mui/material/SvgIcon";
import Edit02Icon from "@untitled-ui/icons-react/build/esm/Edit02";
import {paths} from "../../../paths";

const useChartOptions = (timeLeft, currentProgress) => {
  const theme = useTheme();

  // Determine the color based on progress
  const determineColor = () => {
    if (currentProgress <= 33) {
      return '#B42318'; // Red
    } else if (currentProgress <= 66) {
      return '#FFC107'; // Yellow
    } else {
      return '#10B981'; // Green
    }
  };

  const chartColor = determineColor();
  return {
    chart: {
      background: 'transparent',
      redrawOnParentResize: false,
      redrawOnWindowResize: false,
    },
    colors: [determineColor],
    fill: {
      opacity: 1,
      type: 'solid',
    },
    grid: {
      padding: {
        bottom: 0,
        left: 0,
        right: 0,
        top: 0,
      },
    },
    labels: [`${currentProgress.toFixed(0)}%`],
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            offsetY: -20,
            show: false,

          },
          value: {
            show: true, // Display the label
            fontSize: '24px', // Make the label bigger
            fontWeight: 'bold', // Optional: Make it bold
            color: theme.palette.mode === 'dark'
              ? theme.palette.common.white
              : theme.palette.common.black, // Adjust the color if needed
            formatter() {
              return `${currentProgress.toFixed(0)}%`; // Return the label value
            },
          // value: {
          //   // show: false,
          //   fontSize: '14px',
          //   fontWeight: 500,
          //   formatter() {
          //     // return currentProgress.toFixed(0) + '%';
          //     return 'Complet';
          //   },
            offsetY: -5,
          },
        },
        endAngle: 90,
        hollow: {
          size: '60%',
        },
        startAngle: -90,
        track: {
          background:
            theme.palette.mode === 'dark'
              ? "#6C737F"
              : theme.palette.primary.light,
          strokeWidth: '100%',
        },
      },
    },
    stroke: {
      lineCap: 'round',
    },
    theme: {
      mode: theme.palette.mode,
    },
  };
};
import ReactApexChart from "react-apexcharts";

export const ProfileCompleteProgress = (props) => {
  const { timeCurrent, timeGoal } = props;
  const chartRef = useRef(null); // Ref for the ApexChart instance
  const theme = useTheme();

  const timeLeft = timeGoal - timeCurrent;
  const currentProgress = Math.min((timeCurrent / timeGoal) * 100, 100);

  const chartOptions = useChartOptions(timeLeft, currentProgress);
  const chartSeries = [currentProgress];

  useEffect(() => {
    if (chartRef.current && chartRef.current.chart) {
      chartRef.current.chart.updateOptions(chartOptions, false, true); // Use `.chart` property to access ApexCharts instance
    }
  }, [theme.palette.mode]);

  return (
    <Card>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 2,
        }}
      >
        <CardHeader title="Profil complet" sx={{ p: 1 }} />
      </Box>
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mx: -4,
            my: -7,
          }}
        >
          <Chart
            ref={chartRef} // Pass ref to access ApexCharts instance
            width={260}
            height={260}
            options={chartOptions}
            series={chartSeries}
            type="radialBar"
          />
        </Box>
        <Typography variant="h6" sx={{
          mt: 7,
          // textAlign: 'center'
        }}>
          Completează profilul pentru a crește vizibilitatea!
        </Typography>
        <Typography color="text.secondary" variant="body2"
                    sx={{
                      maxWidth: '24rem',
                      // textAlign: 'center',
                      mt: 0
        }}>
          Modifică detaliile personale și adaugă cât mai multe informații.
        </Typography>
      </CardContent>
    </Card>
  );
};
