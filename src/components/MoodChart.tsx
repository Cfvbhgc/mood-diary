import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { MoodEntry, moodNumericValue, moodConfig, MoodType } from '../types';
import { subDays, format, parseISO } from 'date-fns';

interface Props {
  entries: MoodEntry[];
}

// D3 график настроения за последнюю неделю (7 дней)
export const MoodChart: React.FC<Props> = ({ entries }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const container = svgRef.current.parentElement;
    const width = container ? container.clientWidth : 500;
    const height = 220;
    const margin = { top: 20, right: 20, bottom: 35, left: 40 };

    svg.attr('width', width).attr('height', height);

    // данные за последние 14 дней
    const now = new Date();
    const days = 14;
    const dateRange: { date: string; value: number | null; mood: MoodType | null }[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const d = format(subDays(now, i), 'yyyy-MM-dd');
      const entry = entries.find(e => e.date === d);
      dateRange.push({
        date: d,
        value: entry ? moodNumericValue[entry.mood] : null,
        mood: entry ? entry.mood : null,
      });
    }

    const validData = dateRange.filter(d => d.value !== null) as { date: string; value: number; mood: MoodType }[];

    if (validData.length < 2) {
      svg.append('text')
        .attr('x', width / 2)
        .attr('y', height / 2)
        .attr('text-anchor', 'middle')
        .attr('fill', '#555')
        .text('Недостаточно данных для графика');
      return;
    }

    const xScale = d3.scalePoint()
      .domain(dateRange.map(d => d.date))
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([0.5, 5.5])
      .range([height - margin.bottom, margin.top]);

    // gradient fill под линией
    const defs = svg.append('defs');
    const gradient = defs.append('linearGradient')
      .attr('id', 'chartGradient')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '0%').attr('y2', '100%');
    gradient.append('stop').attr('offset', '0%').attr('stop-color', '#7c3aed').attr('stop-opacity', 0.4);
    gradient.append('stop').attr('offset', '100%').attr('stop-color', '#7c3aed').attr('stop-opacity', 0.02);

    // area
    const area = d3.area<typeof validData[0]>()
      .x(d => xScale(d.date) as number)
      .y0(height - margin.bottom)
      .y1(d => yScale(d.value))
      .curve(d3.curveCatmullRom.alpha(0.5));

    svg.append('path')
      .datum(validData)
      .attr('d', area)
      .attr('fill', 'url(#chartGradient)');

    // линия
    const line = d3.line<typeof validData[0]>()
      .x(d => xScale(d.date) as number)
      .y(d => yScale(d.value))
      .curve(d3.curveCatmullRom.alpha(0.5));

    svg.append('path')
      .datum(validData)
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', '#7c3aed')
      .attr('stroke-width', 2.5)
      .attr('filter', 'drop-shadow(0 0 6px #7c3aed88)');

    // точки с цветами настроения
    svg.selectAll('.dot')
      .data(validData)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d.date) as number)
      .attr('cy', d => yScale(d.value))
      .attr('r', 5)
      .attr('fill', d => moodConfig[d.mood].color)
      .attr('stroke', '#0a0a12')
      .attr('stroke-width', 2)
      .style('filter', d => `drop-shadow(0 0 4px ${moodConfig[d.mood].color}66)`);

    // оси
    const xAxis = d3.axisBottom(xScale)
      .tickValues(dateRange.filter((_, i) => i % 2 === 0).map(d => d.date))
      .tickFormat(d => {
        const parsed = parseISO(d as string);
        return format(parsed, 'dd.MM');
      });

    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(xAxis)
      .selectAll('text')
      .attr('fill', '#666')
      .attr('font-size', '11px');

    svg.selectAll('.domain').attr('stroke', '#333');
    svg.selectAll('.tick line').attr('stroke', '#222');

    // y axis labels
    const moodLabels = ['😠', '😢', '😐', '😌', '😊'];
    moodLabels.forEach((label, i) => {
      svg.append('text')
        .attr('x', margin.left - 8)
        .attr('y', yScale(i + 1))
        .attr('text-anchor', 'end')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', '14px')
        .text(label);
    });

  }, [entries]);

  return (
    <div style={{
      background: 'linear-gradient(135deg, #12121f, #0d0d1a)',
      border: '1px solid #1e1e3a',
      borderRadius: '16px',
      padding: '20px',
      marginBottom: '24px',
    }}>
      <h3 style={{ margin: '0 0 16px', color: '#ccc', fontSize: '14px', fontWeight: 500 }}>
        Настроение за 2 недели
      </h3>
      <div style={{ width: '100%', overflowX: 'auto' }}>
        <svg ref={svgRef} style={{ display: 'block' }} />
      </div>
    </div>
  );
};
