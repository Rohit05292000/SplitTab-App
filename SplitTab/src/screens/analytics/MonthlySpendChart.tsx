import React from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import Svg, { Line, Rect, Text as SvgText, G } from 'react-native-svg';

interface MonthlySpendChartProps {
  data: { month: string; total: number }[];
  currency: string;
}

export const MonthlySpendChart = ({ data, currency }: MonthlySpendChartProps) => {
  const width = 600;
  const height = 300;
  const padding = { top: 20, right: 20, bottom: 40, left: 60 };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // ✅ HANDLE EMPTY DATA
  if (!data.length) {
    return (
      <View style={styles.container}>
        <Text>No data available</Text>
      </View>
    );
  }

  const maxValue = Math.max(...data.map(d => d.total), 1);

  // ✅ PREVENT NEGATIVE WIDTH
  const barWidth = Math.max(chartWidth / data.length - 10, 10);

  const getBarHeight = (value: number) => {
    return (value / maxValue) * chartHeight;
  };

  return (
    <ScrollView horizontal contentContainerStyle={styles.container}>
      <Svg width={width} height={height}>
        {/* Y-axis */}
        <Line
          x1={padding.left}
          y1={padding.top}
          x2={padding.left}
          y2={height - padding.bottom}
          stroke="#ccc"
          strokeWidth="2"
        />

        {/* X-axis */}
        <Line
          x1={padding.left}
          y1={height - padding.bottom}
          x2={width - padding.right}
          y2={height - padding.bottom}
          stroke="#ccc"
          strokeWidth="2"
        />

        {/* Y-axis labels */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const y = height - padding.bottom - ratio * chartHeight;
          const value = (maxValue * ratio).toFixed(0);

          return (
            <G key={`y-${ratio}`}>
              <Line
                x1={padding.left - 5}
                y1={y}
                x2={padding.left}
                y2={y}
                stroke="#999"
                strokeWidth="1"
              />
              <SvgText
                x={padding.left - 10}
                y={y + 4}
                textAnchor="end"
                fontSize="12"
                fill="#666"
              >
                {value}
              </SvgText>
            </G>
          );
        })}

        {/* Bars */}
        {data.map((item, index) => {
          const x = padding.left + (index * chartWidth) / data.length + 5;
          const barHeight = getBarHeight(item.total);
          const y = height - padding.bottom - barHeight;

          return (
            <G key={`${item.month}-${index}`}> {/* ✅ FIXED KEY */}
              <Rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill="#3b82f6"
                rx={4}
              />
              <SvgText
                x={x + barWidth / 2}
                y={height - padding.bottom + 20}
                textAnchor="middle"
                fontSize="12"
                fill="#666"
              >
                {item.month}
              </SvgText>
              <SvgText
                x={x + barWidth / 2}
                y={y - 5}
                textAnchor="middle"
                fontSize="11"
                fill="#333"
                fontWeight="500"
              >
                {item.total > 0 ? `${item.total.toFixed(0)}` : null}
              </SvgText>
            </G>
          );
        })}

        {/* Currency label */}
       <SvgText
         x={padding.left - 35}
         y={padding.top + chartHeight / 2}
         textAnchor="middle"
         fontSize="12"
         fill="#666"
         transform={`rotate(-90 ${padding.left - 35} ${padding.top + chartHeight / 2})`}>
         {`Amount (${currency})`}
        </SvgText>
      </Svg>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
});