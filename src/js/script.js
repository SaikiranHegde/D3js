d3.json('../data/forecast.json', (data) => {
    let temperatures = [], dates = [];
    let color;
    let margin = { top: 0, right: 0, bottom: 20, left: 25 };
    let height = 400 - margin.top - margin.bottom,
        width = 600 - margin.left - margin.right;

    for (let i = 0; i < data.list.length; i++) {
        temperatures.push(data.list[i].main.temp);
        dates.push(new Date(data.list[i].dt_txt));
    }

    let yScale = d3.scaleLinear()
        .domain([0, d3.max(temperatures)])
        .range([0, height]);
    let yAxisValues = d3.scaleLinear()
        .domain([0, d3.max(temperatures)])
        .range([height, 0]);
    let yAxisTicks = d3.axisLeft(yAxisValues)
        .ticks(10);

    let xScale = d3.scaleBand()
        .domain(temperatures)
        .paddingInner(.2)
        .range([0, width]);
    let xAxisValues = d3.scaleTime()
        .domain([dates[0], dates[(dates.length - 1)]])
        .range([0, width]);
    let xAxisTicks = d3.axisBottom(xAxisValues)
        .ticks(d3.timeDay.every(1));

    let maxTemperature = d3.max(temperatures);

    let colors = d3.scaleLinear()
        .domain([0, (maxTemperature * .5), (maxTemperature)])
        .range(['#FFFFFF', '#2D8BCF', '#DA3637']);

    let tooltip = d3.select('body')
        .append('div')
        .style('position', 'absolute')
        .style('padding', '0 10px')
        .style('background', 'white')
        .style('opacity', 0);

    let myChart = d3.select('#viz')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.right + ')')
        .style('background', '#93A1A1')
        .selectAll('rect').data(temperatures)
        .enter()
        .append('rect')
        .attr('fill', colors)
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

            tooltip.html(
                '<div style="font-size: 2rem; font-weight: bold">' + d + '&deg;</div>'
                )
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

    let yGuide = d3.select('#viz svg').append('g')
        .attr('transform', 'translate(20, 0)')
        .call(yAxisTicks);

    let xGuide = d3.select('#viz svg').append('g')
        .attr('transform', 'translate(20,' + height +')')
        .call(xAxisTicks);

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

