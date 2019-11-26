//////////////////////// setup ////////////////////////
//from https://www.youtube.com/watch?v=kK5kKA-0PUQ
//margin, width and height and raduis for teh circle for pie-chart
const margin = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
    },
    width = 500 - margin.right - margin.left,
    height = 500 - margin.top - margin.bottom,
    raduis = width / 2;

// arc generator
const arc = d3
    .arc()
    .outerRadius(raduis - 10)
    .innerRadius(raduis - 100);

const color = d3.scaleOrdinal(d3.schemePaired);

// pie generator
const pie = d3
    .pie()
    .sort(null)
    .value(function (d) {
        return d.countObj;
    });

// define svg for pie-chart
const svg = d3
    .select("#dashboard")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "pie-chart")
    .attr("overflow", "visible")
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// define the margin and the width and height for the bar-chart
const marginBarChart = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20
};
const svgHeight = 380 - marginBarChart.right - marginBarChart.left;
const svgWidth = 500 - marginBarChart.top - marginBarChart.bottom;
const verticalBarSpace = 50;
const barHeight = 30;
/////////////////////////// end setup ////////////////////////////////////
export {
    margin,
    arc,
    pie,
    svg,
    marginBarChart,
    svgHeight,
    svgWidth,
    verticalBarSpace,
    barHeight,
    width,
    height,
    raduis,
    color
};