/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import PropTypes from "prop-types";
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";

function ForecastChart({ data }) {
  // Change Anchor of XAxis Lable
  const customAxisTick = ({ x, y, payload }) => (
    <g transform={`translate(${x},${y})`}>
      <text x={20} y={0} dy={16} fontSize={10} textAnchor="end" fill="#666">
        {payload.value.split("T")[1]}
      </text>
    </g>
  );

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        width={1000}
        height={400}
        data={data}
        margin={{ top: 5, right: 90, bottom: 55, left: 10 }}
      >
        <Line type="monotone" dataKey="numValue" stroke="#8884d8" name="predicted value" />
        <Line
          type="monotone"
          dataKey="histRefValues.prevMonth"
          stroke="#82ca9d"
          name="historical value (last month)"
        />
        <Line
          type="monotone"
          dataKey="histRefValues.prevWeek"
          stroke="#ffc658"
          name="historical value (last week)"
        />

        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis dataKey="datePredicted" tick={customAxisTick} />
        <YAxis
          label={{
            value: `m³/h`,
            style: { textAnchor: "middle" },
            angle: -90,
            position: "left",
            offset: 0,
          }}
          tick={{ fontSize: 14 }}
        />
        <Tooltip
          formatter={(value) =>
            new Intl.NumberFormat("en", {
              maximumFractionDigits: 2,
            }).format(value)
          }
        />
        <Legend />
      </LineChart>
    </ResponsiveContainer>
  );
}

ForecastChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape).isRequired,
};

export default ForecastChart;
