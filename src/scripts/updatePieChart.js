import {
    arc,
    color
} from './helpers.js'
// update pie-chart door de bar-chart
function updatePieChart(data, continentNaam) {
    //update data
    const updatedPie = d3
        .pie()
        .sort(null)
        .value(function (d) {
            const filterDataOpcontinentNaam = d.continenten.filter(
                item => item.gebiedLabel == continentNaam
            );
            const aantalObjectenPerContinent = filterDataOpcontinentNaam.map(
                item => item.aantalObjInGebied
            );
            return aantalObjectenPerContinent[0];
        });

    // update the paths
    d3.selectAll("path")
        .data(updatedPie(data))
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

    //update the title
    d3.select(".pie-title")
        .data(data)
        .text(function (d) {
            const filterDataOpcontinentNaam = d.continenten.filter(
                item => item.gebiedLabel == continentNaam
            );
            const NaamVanDeContinent = filterDataOpcontinentNaam.map(
                item => item.gebiedLabel
            );
            return NaamVanDeContinent[0];
        });

    // update the number on hover
    d3.selectAll(".aantalObjecten").text(function (d) {
        const filterDataOpcontinentNaam = d.data.continenten.filter(
            item => item.gebiedLabel == continentNaam
        );
        const aantalObjectenPerContinent = filterDataOpcontinentNaam.map(
            item => item.aantalObjInGebied
        );
        return aantalObjectenPerContinent[0];
    });
}

export {
    updatePieChart
}