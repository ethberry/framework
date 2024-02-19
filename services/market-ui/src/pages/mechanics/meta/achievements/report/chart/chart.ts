import * as d3 from "d3";

export type DonutChartData = [string, number][];

export interface IDonutChartProps {
  data: DonutChartData;
  name?: (d: [string, number]) => string;
  value?: (d: [string, number]) => number;
  level?: number;
  score?: string;
  title?: (d: [string, number]) => string;
  width?: number;
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  labelRadius?: number;
  format?: string;
  names?: string[];
  colors?: string[];
  stroke?: string;
  strokeWidth?: number;
  strokeLinejoin?: string;
  padAngle?: number;
  startAngle?: number;
  endAngle?: number;
}

// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/donut-chart
export function DonutChart({
  data,
  name = ([x]) => x,
  value = ([, y]) => y,
  level = 1,
  score = "1 / 5",
  title,
  width = 150,
  height = 150,
  innerRadius = Math.min(width, height) / 3.5,
  outerRadius = Math.min(width, height) / 2,
  labelRadius = (innerRadius + outerRadius) / 2,
  format = ",",
  names,
  colors,
  stroke = innerRadius > 0 ? "none" : "white",
  strokeWidth = 3,
  strokeLinejoin = "round",
  padAngle = stroke === "none" ? 1 / outerRadius : 0,
}: IDonutChartProps) {
  // Compute values.
  const N = d3.map(data, name);
  const V = d3.map(data, value);
  const I = d3.range(N.length).filter(i => !isNaN(V[i]));

  // Unique the names.
  if (names === undefined) names = N;
  // @ts-ignore
  names = new d3.InternSet(names);

  // Chose a default color scheme based on cardinality.
  if (colors === undefined) {
    // @ts-ignore
    colors = d3.schemeSpectral[names.size];
  }
  if (colors === undefined) {
    // @ts-ignore
    colors = d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), names.size);
  }

  // Construct scales.
  // @ts-ignore
  const color = d3.scaleOrdinal(names, colors);

  // Compute titles.
  if (title === undefined) {
    const formatValue = d3.format(format);
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    title = i => `${formatValue(V[i])}%`;
  } else {
    const O = d3.map(data, d => d);
    const T = title;
    // @ts-ignore
    title = i => T(O[i], i, data);
  }

  // Construct arcs.
  const arcs = d3
    .pie()
    .padAngle(padAngle)
    .startAngle(Math.PI)
    .endAngle(Math.PI * 3)
    .sort(null)
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    .value(i => V[i])(I);
  const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);
  const arcLabel = d3.arc().innerRadius(labelRadius).outerRadius(labelRadius);

  const svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [-width / 2, -height / 2, width, height + 20])
    .attr("style", "margin-bottom: 20px; max-width: 100%; height: auto; height: intrinsic;");

  svg
    .append("g")
    .append("line")
    .attr("stroke", "#000000")
    .attr("strokeWidth", 1)
    .attr("x1", -35)
    .attr("y1", 0)
    .attr("x2", 35)
    .attr("y2", 0);

  svg
    .append("g")
    .attr("fill", "#000000")
    .attr("font-family", "sans-serif")
    .attr("text-anchor", "middle")
    .selectAll("text")
    .data([{ title: level }, { title: score }])
    .join("text")
    .attr("font-size", (_, i) => (i === 0 ? 22 : 16))
    .attr("x", 0)
    .attr("y", (_, i) => `${i * 1.6 - 0.45}em`)
    .text(d => d.title);

  svg
    .append("g")
    .attr("stroke", stroke)
    .attr("stroke-width", strokeWidth)
    .attr("stroke-linejoin", strokeLinejoin)
    .selectAll("path")
    .data(arcs)
    .join("path")
    // @ts-ignore
    .attr("fill", d => color(N[d.data]))
    // @ts-ignore
    .attr("d", arc);

  svg
    .append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .attr("text-anchor", "middle")
    .selectAll("text")
    .data(arcs)
    .join("text")
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    .attr("transform", d => `translate(${arcLabel.centroid(d)})`)
    .selectAll("tspan")
    .data(d => {
      // @ts-ignore
      const lines = `${title(d.data)}`.split(/\n/);
      return d.endAngle - d.startAngle > 0.25 ? lines : lines.slice(0, 1);
    })
    .join("tspan")
    .attr("fill", d => {
      if (Number(d.slice(0, -1)) < 5) {
        return "#000000";
      }
      return "#FFFFFF";
    })
    .attr("x", 0)
    .attr("y", (d: string, i) => {
      if (Number(d.slice(0, -1)) < 5) {
        return "2.8em";
      }
      return `${i * 1.1}em`;
    })
    .attr("font-weight", (_, i) => (i ? null : "bold"))
    .text(d => (d === "0%" ? "" : d));

  // @ts-ignore
  return Object.assign(svg.node(), { scales: { color } }) as SVGElement;
}
