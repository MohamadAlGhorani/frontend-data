import {
    updateBarChart
} from './updateBarChart.js'
import {
    resetPieChart
} from './resetPieChart'
import {
    pieTween
} from './pieTween.js'
import {
    svg,
    arc,
    pie,
    color,
} from './helpers.js'

function makePieChart(data) {
    // parse the  data
    data.forEach(function (d) {
        d.countObj = +d.countObj; // "23" => 23
        d.categoryLabel = d.categoryLabel; // "name" => "name"
    });

    //append g element (.arc)
    const g = svg
        .selectAll(".arc")
        .data(pie(data))
        .enter()
        .append("g")
        .attr("class", "arc")
        .style("cursor", "pointer");

    // append path to g(.arc)
    g.append("path")
        .attr("d", arc)
        .style("fill", function (d) {
            return color(d.data.categoryLabel);
        })
        .transition()
        .ease(d3.easeLinear)
        .duration(1000)
        .attrTween("d", pieTween);


    //appen the text (labels)
    g.append("text")
        .attr("transform", "translate(0, 30)")
        .attr("class", "label")
        .attr("text-anchor", "middle")
        .attr("font-size", 10)
        .attr("dy", ".35em")
        .text(function (d) {
            return d.data.categoryLabel;
        });

    // sum objecten in the midle of the donut-chart
    g.append("text")
        .attr("class", "aantalObjecten")
        .attr("text-anchor", "middle")
        .attr("font-size", "28")
        .attr("dy", ".35em")
        .text(function (d) {
            return d.data.countObj;
        });

    //add title
    svg
        .append("text")
        .attr("class", "pie-title")
        .text("Totaal")
        .attr("x", -25)
        .attr("y", -240)
        .style("font-size", "18");

    // on click update bar-chart and reset the pie-cahrt
    d3.selectAll(".arc").on("click", function () {
        //console.dir(this)
        const categroieColor = this.childNodes[0].style.fill;
        const categorieNumber = this.__data__.index;
        updateBarChart(data, categorieNumber, categroieColor);
        resetPieChart(data);
    });
}

export {
    makePieChart
}