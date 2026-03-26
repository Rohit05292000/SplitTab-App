import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { G, Path, Circle, Text as SvgText } from 'react-native-svg';

interface CategoryBreakdownChartProps {
  data: { category: string; total: number }[];
  currency: string;
}

export const CategoryBreakdownChart = ({ data, currency }: CategoryBreakdownChartProps) => {
  const size = 300;
  const svgSize = size + 100;

  const centerX = svgSize / 2; // ✅ FIXED CENTER
  const centerY = svgSize / 2; // ✅ FIXED CENTER
  const radius = 100;

  const total = data.reduce((sum, item) => sum + item.total, 0);

  // ✅ HANDLE EMPTY / ZERO DATA
  if (!data.length || total === 0) {
    return (
      <View style={styles.container}>
        <Text>No data available</Text>
      </View>
    );
  }

  const colors = [
    '#3b82f6',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#8b5cf6',
  ];

  let currentAngle = -90;

  const slices = data.map((item, index) => {
    const percentage = (item.total / total) * 100;
    const angle = (item.total / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);

    const largeArcFlag = angle > 180 ? 1 : 0;

    const path = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z',
    ].join(' ');

    currentAngle = endAngle;

    return {
      path,
      color: colors[index % colors.length],
      category: item.category,
      total: item.total,
      percentage: Number(percentage.toFixed(1)), // ✅ FIXED TYPE
    };
  });

  return (
    <View style={styles.container}>
      <Svg width={svgSize} height={svgSize}>
        {/* Slices */}
        {slices.map((slice) => (
          <G key={slice.category}> {/* ✅ FIXED KEY */}
            <Path d={slice.path} fill={slice.color} />
          </G>
        ))}

        {/* Center circle */}
        <Circle cx={centerX} cy={centerY} r={radius * 0.6} fill="white" />

        {/* Center Text */}
        <SvgText
          x={centerX}
          y={centerY - 5}
          textAnchor="middle"
          fontSize="14"
          fill="#666"
        >
          Total
        </SvgText>
        <SvgText
          x={centerX}
          y={centerY + 15}
          textAnchor="middle"
          fontSize="18"
          fontWeight="600"
          fill="#333" >
          {`${currency} ${total.toFixed(0)}`}
      </SvgText>
      </Svg>

      {/* Legend */}
      <View style={styles.legend}>
        {slices.map((slice) => (
          <View key={slice.category} style={styles.legendItem}> {/* ✅ FIXED KEY */}
            <View style={[styles.colorBox, { backgroundColor: slice.color }]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.category}>{slice.category}</Text>
              <Text style={styles.subText}>
                 {`${currency} ${slice.total.toFixed(2)} (${slice.percentage}%)`}
                </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center', // ❌ removed gap
  },
  legend: {
    width: '100%',
    maxWidth: 300,
    marginTop: 16, // ✅ spacing instead of gap
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  colorBox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 8,
  },
  category: {
    fontSize: 14,
    fontWeight: '500',
  },
  subText: {
    fontSize: 12,
    color: '#6b7280',
  },
});