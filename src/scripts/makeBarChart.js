import {
    svgHeight,
    svgWidth,
    verticalBarSpace,
    barHeight
} from './helpers.js'

import {
    updatePieChart
} from './updatePieChart.js'

function makeBarChart(data, n) {
    console.log(data);
    // define svg for barchart
    const svg2 = d3
        .select("#dashboard")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .attr("overflow", "visible")
        .attr("class", "bar-chart");

    // genrate groups
    const g = svg2
        .selectAll(".group-bar")
        .data(data[n].continenten)
        .enter()
        .append("g")
        .attr("class", "group-bar")
        .style("cursor", "pointer");

    // make scale
    const Yscale = d3
        .scaleLinear()
        .domain([0, d3.max(data[n].continenten, d => d.aantalObjInGebied)])
        .range([0, svgHeight]);

    // make bars
    d3.select(".group-bar")
        .selectAll(".bar")
        .data(data[n].continenten)
        .enter();
    g.append("rect")
        .attr("class", "bar")
        .style("fill", "rgb(166, 206, 227)")
        .attr("x", 25)
        .attr("y", function (d, i) {
            return i * verticalBarSpace;
        })
        .attr("height", barHeight)
        .transition()
        .ease(d3.easeLinear)
        .duration(800)
        .attr("width", d => Yscale(d.aantalObjInGebied) + 1);

    //make tool tip with aantalopbjecten
    d3.select(".group-bar")
        .selectAll(".bar-text")
        .data(data[n].continenten)
        .enter();
    g.append("text")
        .attr("class", "bar-text")
        .text(d => d.aantalObjInGebied + " objecten")
        .attr("y", function (d, i) {
            return i * verticalBarSpace + barHeight / 2;
        })
        .transition()
        .ease(d3.easeLinear)
        .duration(800)
        .attr("x", d => Yscale(d.aantalObjInGebied) + 50);

    // make labels
    d3.select(".group-bar")
        .selectAll(".bar-label")
        .data(data[n].continenten)
        .enter();
    g.append("text")
        .attr("class", "bar-label")
        .attr("text-anchor", "end")
        .text(d => d.gebiedLabel)
        .attr("x", 0)
        .attr("y", function (d, i) {
            return i * verticalBarSpace + barHeight / 2;
        });

    // make dynamisch title
    svg2
        .append("text")
        .attr("class", "bar-title")
        .text(data[n].categoryLabel)
        .attr("x", 25)
        .attr("y", -30)
        .style("font-size", "18");

    // add axis
    var yAxis = d3.axisBottom(Yscale).ticks(5)
    svg2.append("g")
        .attr("transform", "translate(25,240)")
        .attr("class", "y-axis")
        .call(yAxis)

    // on click update pie-chart
    d3.selectAll(".bar").on("click", function (d, i) {
        //console.dir(this)
        const continentNaam = this.__data__.gebiedLabel;
        updatePieChart(data, continentNaam);
    });
}

export {
    makeBarChart
}