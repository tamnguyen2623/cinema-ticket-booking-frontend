import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";
export const ApexBarChart = ({ data, categories }) => {
  console.log(data)
  console.log(categories)
  const [state, setState] = useState({
    series: [
      {
        data: data,
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 500,
      },
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: categories,
        title: {
          text: "Revenue ($)",
          style: {
            fontSize: "14px",
            fontWeight: 600,
            cssClass: "apexcharts-xaxis-title",
          },
        },
      },
      yaxis: {
        reversed: false,
        axisTicks: {
          show: true,
        },
        rotate: 0,
        title: {
          text: "Movie name",
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
          type="bar"
          height={350}
        />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};
