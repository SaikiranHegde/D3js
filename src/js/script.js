const barData = [];

for (let i = 0; i < 100; i++) {
    barData.push(Math.random() * 30);
}

const height = 400, width = 600, barWidth = 50, barOffset = 5;

let yScale = d3.scaleLinear()
                .domain([0, d3.max(barData)])
                .range([0, height]);

let xScale = d3.scaleBand()
                .domain(barData)
                .paddingInner(.3)
                .range([0, width]);

let colors = d3.scaleLinear()
                .domain([0, barData.length * .33, barData.length * .66, barData.length])
                .range(['#FFB832', '#C61C6F', '#268BD2', '#85992C']);

d3.select('#viz')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('background', '#93A1A1')
.selectAll('rect').data(barData)
    .enter()
    .append('rect')
    .attr('fill', (d, i) => {
        return colors(i);
    })
    .attr('width', (d) => {
        return xScale.bandwidth();
    })
    .attr('height', (d) => {
        return yScale(d);
    })
    .attr('x', (d) => {
        return xScale(d);
    })
    .attr('y', (d) => {
        return height - yScale(d);
    })
