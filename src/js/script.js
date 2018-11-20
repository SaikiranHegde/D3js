d3.json('../data/forecast.json', (data) => {
    let temperatures = [];
    let color;
    const height = 400, width = 600, barWidth = 50, barOffset = 5;

    for (let i = 0; i < data.list.length; i++) {
        temperatures.push(data.list[i].main.temp);
    }

    let yScale = d3.scaleLinear()
        .domain([0, d3.max(temperatures)])
        .range([0, height]);

    let xScale = d3.scaleBand()
        .domain(temperatures)
        .paddingInner(.3)
        .range([0, width]);

    let colors = d3.scaleLinear()
        .domain([0, temperatures.length * .33, temperatures.length * .66, temperatures.length])
        .range(['#FFB832', '#C61C6F', '#268BD2', '#85992C']);

    let tooltip = d3.select('body')
        .append('div')
        .style('position', 'absolute')
        .style('padding', '0 10px')
        .style('background', 'white')
        .style('opacity', 0);

    let myChart = d3.select('#viz')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .style('background', '#93A1A1')
        .selectAll('rect').data(temperatures)
        .enter()
        .append('rect')
        .attr('fill', (d, i) => {
            return colors(i);
        })
        .attr('width', (d) => {
            return xScale.bandwidth();
        })
        .attr('height', 0)
        .attr('x', (d) => {
            return xScale(d);
        })
        .attr('y', height)
        .on('mouseover', function (d) {
            tooltip.transition()
                .duration(200)
                .style('opacity', .9);

            tooltip.html(d)
                .style('left', (d3.event.pageX - 35) + 'px')
                .style('top', (d3.event.pageY - 30) + 'px');

            color = this.style.fill;
            d3.select(this)
                .style('fill', 'yellow');
        })
        .on('mouseout', function (d) {
            tooltip.transition()
                .duration(200)
                .style('opacity', 0);

            d3.select(this)
                .style('fill', color);
        });


    myChart.transition()
        .attr('height', (d) => {
            return yScale(d);
        })
        .attr('y', (d) => {
            return height - yScale(d);
        })
        .delay((d, i) => {
            return i * 20;
        })
        .duration(1000)
        .ease(d3.easeBounceOut);
})

