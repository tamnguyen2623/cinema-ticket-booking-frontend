import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";

export const ApexColumnChart = ({ data, categories }) => {
  console.log(data);
  const [state, setState] = useState({
    series: [
      {
        data: data,
      },
    ],
    options: {
      chart: {
        height: "500px",
        width: "100%",
        type: "bar",
        events: {
          click: function (chart, w, e) {
            // console.log(chart, w, e)
          },
        },
      },
      //   colors: colors,
      // plotOptions: {
      //   bar: {
      //     columnWidth: "80%",
      //     distributed: true,
      //   },
      // },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: true,
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
          text: 'Month',
          style: {
            fontSize: '14px',
            fontWeight: 600,
            cssClass: 'apexcharts-xaxis-title'
          }
        }
      },
      yaxis: {
        title: {
          text: 'Revenue ($)',
          style: {
            fontSize: '14px',
            fontWeight: 600,
            cssClass: 'apexcharts-yaxis-title'
          }
        }
      }
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
