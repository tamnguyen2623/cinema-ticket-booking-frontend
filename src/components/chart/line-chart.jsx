import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

export const ApexLineChart = ({ data, categories }) => {
  const [chartOptions, setChartOptions] = useState({
    chart: {
      height: "500px",
      type: "line",
      zoom: {
        enabled: false,
      },
    },
    stroke: {
      curve: "straight",
    },
    xaxis: {
      categories: categories,
      labels: {
        style: {
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
  });

  const [series, setSeries] = useState([
    {
      name: "Revenue",
      data: data,
    },
  ]);

  // Cập nhật dữ liệu khi `data` hoặc `categories` thay đổi
  useEffect(() => {
    setSeries([{ name: "Revenue", data: data }]);
    setChartOptions((prevOptions) => ({
      ...prevOptions,
      xaxis: { ...prevOptions.xaxis, categories: categories },
    }));
  }, [data, categories]);

  return (
    <div>
      <div id="chart">
        <ReactApexChart
          options={chartOptions}
          series={series}
          type="line"
          height={350}
        />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};
