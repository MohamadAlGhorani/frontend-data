import {
    svgHeight,
    verticalBarSpace,
    barHeight,
} from './helpers.js'

function updateBarChart(data, n, color) {
    //console.log(data[n])
    // get scale from the biggest category
    const Yscale = d3
        .scaleLinear()
        .domain([0, d3.max(data[0].continenten, d => d.aantalObjInGebied)])
        .range([0, svgHeight]);

    //update bars
    const bar = d3.selectAll(".bar").data(data[n].continenten);

    bar
        .enter()
        .append("rect")
        .merge(bar)
        .style("fill", color)
        .attr("class", "bar")
        .transition()
        .ease(d3.easeLinear)
        .duration(500)
        .attr("width", d => Yscale(d.aantalObjInGebied) + 1);

    bar.exit().remove();

    // update bar text (aantalobjecten)
    const barText = d3.selectAll(".bar-text").data(data[n].continenten);

    barText
        .enter()
        .append("text")
        .merge(barText)
        .attr("class", "bar-text")
        .text(d => d.aantalObjInGebied + " objecten")
        .attr("x", d => Yscale(d.aantalObjInGebied) + 50);

    barText.exit().remove();

    // update label
    const barLabel = d3.selectAll(".bar-label").data(data[n].continenten);

    barLabel
        .enter()
        .append("text")
        .merge(barLabel)
        .attr("class", "bar-label")
        .text(d => d.gebiedLabel)
        .transition()
        .ease(d3.easeLinear)
        .duration(200)
        .attr("y", 220)
        .style("font-size", "3")
        .transition()
        .ease(d3.easeLinear)
        .duration(300)
        .delay(function (d, i) {
            return i * 100 + barHeight / 2;
        })
        .attr("y", function (d, i) {
            return i * verticalBarSpace + barHeight / 2;
        })
        .style("font-size", "16")
        .attr("x", 0);

    barLabel.exit().remove();

    //update title
    d3.select(".bar-chart")
        .select(".bar-title")
        .text("Categorie: " + data[n].categoryLabel);
}

export {
    updateBarChart
}