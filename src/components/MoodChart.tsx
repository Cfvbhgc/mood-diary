// D3.js график настроений — organic bezier curves с анимацией рисования
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { MoodEntry, MoodType, MOOD_CONFIGS } from '../types';

interface Props {
  entries: MoodEntry[];
}

// Числовое значение настроения для графика
const moodToValue: Record<MoodType, number> = {
  angry: 1,
  anxious: 2,
  sad: 3,
  calm: 4,
  happy: 5,
};

const moodLabels: Record<number, string> = {
  1: 'Злость',
  2: 'Тревога',
  3: 'Грусть',
  4: 'Покой',
  5: 'Радость',
};

const MoodChart: React.FC<Props> = ({ entries }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const drawnRef = useRef(false);

  useEffect(() => {
    if (!svgRef.current || entries.length < 2) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const containerWidth = containerRef.current?.clientWidth || 800;
    const width = containerWidth - 20;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 40, left: 60 };
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Сортировка по дате
    const sorted = [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const data = sorted.map((e) => ({
      date: new Date(e.date),
      value: moodToValue[e.mood],
      mood: e.mood,
      text: e.text,
    }));

    // Шкалы
    const xScale = d3.scaleTime()
      .domain(d3.extent(data, (d) => d.date) as [Date, Date])
      .range([0, innerW]);

    const yScale = d3.scaleLinear()
      .domain([0.5, 5.5])
      .range([innerH, 0]);

    // Сетка
    g.append('g')
      .attr('class', 'chart-grid')
      .selectAll('line')
      .data([1, 2, 3, 4, 5])
      .enter()
      .append('line')
      .attr('x1', 0)
      .attr('x2', innerW)
      .attr('y1', (d) => yScale(d))
      .attr('y2', (d) => yScale(d));

    // Ось Y — лейблы настроений
    g.append('g')
      .attr('class', 'chart-axis')
      .selectAll('text')
      .data([1, 2, 3, 4, 5])
      .enter()
      .append('text')
      .attr('x', -10)
      .attr('y', (d) => yScale(d))
      .attr('dy', '0.35em')
      .attr('text-anchor', 'end')
      .text((d) => moodLabels[d]);

    // Ось X
    const xAxis = d3.axisBottom(xScale)
      .ticks(5)
      .tickFormat((d) => {
        const date = d as Date;
        const day = date.getDate();
        const monthNames = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
        return `${day} ${monthNames[date.getMonth()]}`;
      });

    g.append('g')
      .attr('class', 'chart-axis')
      .attr('transform', `translate(0,${innerH})`)
      .call(xAxis);

    // Градиент для заливки под линией
    const gradientId = 'chart-area-gradient';
    const defs = svg.append('defs');
    const gradient = defs.append('linearGradient')
      .attr('id', gradientId)
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '0%').attr('y2', '100%');
    gradient.append('stop').attr('offset', '0%').attr('stop-color', 'var(--mood-color)').attr('stop-opacity', 0.2);
    gradient.append('stop').attr('offset', '100%').attr('stop-color', 'var(--mood-color)').attr('stop-opacity', 0);

    // Область под линией
    const area = d3.area<typeof data[0]>()
      .x((d) => xScale(d.date))
      .y0(innerH)
      .y1((d) => yScale(d.value))
      .curve(d3.curveCatmullRom.alpha(0.5));

    g.append('path')
      .datum(data)
      .attr('fill', `url(#${gradientId})`)
      .attr('d', area);

    // Линия — bezier curve
    const line = d3.line<typeof data[0]>()
      .x((d) => xScale(d.date))
      .y((d) => yScale(d.value))
      .curve(d3.curveCatmullRom.alpha(0.5));

    const path = g.append('path')
      .datum(data)
      .attr('class', 'chart-line')
      .attr('stroke', 'var(--mood-color)')
      .attr('d', line);

    // Анимация рисования линии
    const totalLength = (path.node() as SVGPathElement)?.getTotalLength() || 0;
    if (!drawnRef.current) {
      path
        .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
        .attr('stroke-dashoffset', totalLength)
        .transition()
        .duration(2000)
        .ease(d3.easeCubicOut)
        .attr('stroke-dashoffset', 0);
      drawnRef.current = true;
    }

    // Точки
    g.selectAll('.chart-dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'chart-dot')
      .attr('cx', (d) => xScale(d.date))
      .attr('cy', (d) => yScale(d.value))
      .attr('r', 4)
      .attr('fill', (d) => MOOD_CONFIGS[d.mood].color)
      .attr('stroke', 'var(--bg-card)')
      .attr('stroke-width', 2);
  }, [entries]);

  return (
    <div className="mood-chart-wrapper" ref={containerRef}>
      <svg ref={svgRef} />
    </div>
  );
};

export default MoodChart;
