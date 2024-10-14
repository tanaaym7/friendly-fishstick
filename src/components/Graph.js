import React, { useState, useEffect } from "react";
import { LineChart } from "@mui/x-charts/LineChart";

export default function BasicLineChart() {
  const [jobTrendsData, setJobTrendsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://test.elcarreira.com/careerpath/getJobTrends?course=B.Com",
        );
        const data = await response.json();
      console.log(data)
      } catch (error) {
        console.error("Error fetching job trends data:", error);
      }
    };

    fetchData();
  }, []);

  const NoOfDays = jobTrendsData.map((value) => value.name);
  const NoOfJobs = jobTrendsData.map((value) => value.numJobs);

  return (
    <LineChart
      xAxis={[
        {
          data: NoOfDays,
          label: "Days",
          scaleType: "point",
        },
      ]}
      yAxis={[
        {
          label: "No of jobs",
        },
      ]}
      series={[
        {
          label: "No of jobs",
          data: NoOfJobs,
        },
      ]}
      grid={{ vertical: true, horizontal: true }}
      width={500}
      height={300}
    />
  );
}
