import {
    arc,
    color
} from './helpers.js'

// reset pie-cahrt en show the totaal.
function resetPieChart(data) {
    const resetPie = d3
        .pie()
        .sort(null)
        .value(function (d) {
            return d.countObj;
        });
    d3.selectAll("path")
        .data(resetPie(data))
        .attr("d", arc)
        .style("fill", function (d) {
            return color(d.data.categoryLabel);
        })
        // this transition came from http://bl.ocks.org/dbuezas/9306799
        .transition()
        .duration(1000)
        .attrTween("d", function (d) {
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function (t) {
                return arc(interpolate(t));
            };
        });

    // update title
    d3.select(".pie-title").text("Totaal").attr("x", -25);

    // update label in the pie-chart
    d3.selectAll(".aantalObjecten").text(function (d) {
        return d.data.countObj;
    });
}

export {
    resetPieChart
}