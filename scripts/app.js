//margin, width and height and raduis for teh circle
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
const arc = d3.arc()
    .outerRadius(raduis - 10)
    .innerRadius(raduis - 100);

const color = d3.scaleOrdinal(d3.schemePaired);


// pie generator
const pie = d3.pie()
    .sort(null)
    .value(function (d) {
        return d.countObj
    });

// define svg for piechart
const svg = d3.select("#dashboard").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "pie-chart")
    .attr("overflow", "visible")
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");



const eindpoint = "https://api.data.netwerkdigitaalerfgoed.nl/datasets/ivo/NMVW/services/NMVW-22/sparql";
const categorieLength = 19
const categorieQuery = `
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX dc: <http://purl.org/dc/elements/1.1/>
PREFIX dct: <http://purl.org/dc/terms/>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX edm: <http://www.europeana.eu/schemas/edm/>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
# tel aantallen per materiaal
SELECT ?category ?categoryLabel (COUNT(?cho) AS ?choCount) WHERE {
 <https://hdl.handle.net/20.500.11840/termmaster2802> skos:narrower ?category .
 ?category skos:prefLabel ?categoryLabel .
 ?category skos:narrower* ?subcategory .
 ?cho edm:isRelatedTo ?subcategory .
 ?cho dct:spatial ?place .
}
GROUP BY ?category ?categoryLabel
ORDER BY DESC(?choCount)`;

runQuery(eindpoint, categorieQuery)
    .then(loopData)
    .then(prettyData => {
        makePieChart(prettyData)
        //makeBarChart(prettyData, 0)
    })

function makeBarChart(data, n) {

    d3.select(".bar-chart").remove().exit();

    const marginBarChart = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
    }
    const svgHeight = 380 - marginBarChart.right - marginBarChart.left;
    const svgWidth = 500 - marginBarChart.top - marginBarChart.bottom;
    const verticalBarSpace = 50;
    const barHeight = 30;

    console.log(data)

    // define svg for barchart
    const svg2 = d3.select("#dashboard").append("svg")
        .attr("width", svgWidth)
        .attr('height', svgHeight)
        .attr("overflow", "visible")
        .attr('class', 'bar-chart')

    svg2.selectAll(".group-bar").remove().exit();

    const g = svg2.selectAll(".group-bar")
        .data(data[n].continenten)
        .enter().append('g')
        .attr("class", "group-bar");

    const Yscale = d3.scaleLinear()
        .domain([0, d3.max(data[n].continenten, d => d.aantalObjInGebied)])
        .range([0, svgHeight])

    d3.select('.group-bar').selectAll('.bar')
        .data(data[n].continenten)
        .enter()
    g.append('rect')
        .attr('class', 'bar')
        .style('fill', 'red')
        .attr('x', 25)
        .attr('y', function (d, i) {
            // console.log(d, i);
            return i * verticalBarSpace
        })
        .attr('height', barHeight)
        .transition()
        .ease(d3.easeLinear)
        .duration(800)
        .attr("width", d => Yscale(d.aantalObjInGebied) + 10)

    d3.select('.group-bar').selectAll('.bar-text')
        .data(data[n].continenten)
        .enter()
    g.append('text')
        .attr('class', 'bar-text')
        .style('fill', 'black')
        .text(d => d.aantalObjInGebied)
        .attr('y', function (d, i) {
            // console.log(d, i);
            return (i * verticalBarSpace) + barHeight / 2
        })
        .transition()
        .ease(d3.easeLinear)
        .duration(800)
        .attr('x', d => Yscale(d.aantalObjInGebied) + 60)

    d3.select('.group-bar').selectAll('.bar-label')
        .data(data[n].continenten)
        .enter()
    g.append('text')
        .attr('class', 'bar-label')
        .attr('text-anchor', "end")
        .style('fill', 'black')
        .text(d => d.gebiedLabel)
        .attr('x', 0)
        .attr('y', function (d, i) {
            // console.log(d, i);
            return (i * verticalBarSpace) + barHeight / 2
        })
}

function makePieChart(data) {
    // parse the  data
    //console.dir(data)
    data.forEach(function (d) {
        d.countObj = +d.countObj; // "23" => 23
        d.categoryLabel = d.categoryLabel; // "name" => "name"
    });

    //append g element (.arc)
    const g = svg.selectAll(".arc")
        .data(pie(data))
        .enter().append('g')
        .attr("class", "arc");

    // append path to g(.arc)
    g.append("path")
        .attr("d", arc)
        .style("fill", function (d) {
            return color(d.data.categoryLabel)
        })
        .transition()
        .ease(d3.easeLinear)
        .duration(1000)
        .attrTween("d", pieTween);

    //appen the text (labels)
    g.append('text')
        .attr('transform', 'translate(0, 30)')
        .attr('class', 'label')
        .attr('text-anchor', 'middle')
        .attr('font-size', '10')
        .attr("dy", ".35em")
        .text(function (d) {
            return d.data.categoryLabel;
        });

    // aantal objecten in het middle
    g.append('text')
        .attr("class", "aantalObjecten")
        .attr('text-anchor', 'middle')
        .attr('font-size', '28')
        .attr("dy", ".35em")
        .text(function (d) {
            return d.data.countObj;
        });
    console.log(data)
    d3.selectAll(".arc")
        .on("click", function () {
            categorieNumber = this.__data__.index
            return makeBarChart(data, categorieNumber)
        })
}




// functie die zorgt dat alles op 0 staat voor dat de data binnen komt zodat de animatie werkt van de pie cahrt
function pieTween(b) {
    b.innerRadius = 0;
    const i = d3.interpolate({
        startAngle: 0,
        endAngle: 0
    }, b);
    return function (t) {
        return arc(i(t));
    }

}

function getGeoQueryForCategory(category) {
    return `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX dc: <http://purl.org/dc/elements/1.1/>
    PREFIX dct: <http://purl.org/dc/terms/>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    PREFIX edm: <http://www.europeana.eu/schemas/edm/>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
           # tel aantallen per continent
    SELECT ?continentLabel (COUNT(?cho) AS ?choCount) 
    
    WHERE {
           # haal van een term in de thesaurus de subcategorieen op
           ${category} skos:narrower* ?subcategorie .
           # haal de objecten van deze subcategorieen en de plaats
           ?cho edm:isRelatedTo ?subcategorie .
           ?cho dct:spatial ?place .
           # check het continent
           <https://hdl.handle.net/20.500.11840/termmaster2> skos:narrower ?continent .
           ?continent skos:prefLabel ?continentLabel .
           ?continent skos:narrower* ?place .
    } GROUP BY ?continentLabel
    ORDER BY DESC(?choCount)`;
}

function loopData(data) {
    return data
        .map(item => {
            return {
                category: `<${item.category.value}>`,
                categoryLabel: item.categoryLabel.value,
                countObj: item.choCount.value,
            }
        })
        .reduce(async (newData, currentItem) => {
            const dataToReturn = await newData
            const continentenVoorCurrentItem = await runQuery(eindpoint, getGeoQueryForCategory(currentItem.category))
                .then(data => {
                    return data
                        .map(item => {
                            return {
                                gebiedLabel: item.continentLabel.value,
                                aantalObjInGebied: Number(item.choCount.value)
                            }
                        })
                })

            currentItem.continenten = continentenVoorCurrentItem
            dataToReturn.push(currentItem)
            return dataToReturn
        }, [])
}


function runQuery(url, query) {
    return fetch(url + "?query=" + encodeURIComponent(query) + "&format=json")
        .then(res => res.json())
        .then(data => data.results.bindings)
        .catch(error => {
            console.log(error)
        })
}