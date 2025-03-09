import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";

export const ApexLineChart = ({ data, categories }) => {
  console.log(data);
  const [state, setState] = useState({
    series: [
      {
        name: "Revenue",
        data: data,
      },
    ],
    options: {
      chart: {
        height: "500px",
        width: "100%",
        type: "line",
        zoom: {
          enabled: false,
        },
      },
      //   colors: colors,
      plotOptions: {
        bar: {
          columnWidth: "80%",
          distributed: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: true,
      },
      stroke: {
        curve: 'straight'
      },
      xaxis: {
        categories: categories,
        labels: {
          style: {
            // colors: colors,
            fontSize: "10px",
          },
          rotate: 0,
        },
        title: {
          text: "Day",
          style: {
            fontSize: "14px",
            fontWeight: 600,
            cssClass: "apexcharts-xaxis-title",
          },
        },
      },
      yaxis: {
        title: {
          text: "Revenue ($)",
          style: {
            fontSize: "14px",
            fontWeight: 600,
            cssClass: "apexcharts-yaxis-title",
          },
        },
      },
    },
  });

  return (
    <div>
      <div id="chart">
        <ReactApexChart
          options={state.options}
          series={state.series}
          type="line"
          height={500}
        />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};
