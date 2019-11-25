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

// define svg for pie-chart
const svg = d3.select("#dashboard").append("svg")
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
}
const svgHeight = 380 - marginBarChart.right - marginBarChart.left;
const svgWidth = 500 - marginBarChart.top - marginBarChart.bottom;
const verticalBarSpace = 50;
const barHeight = 30;
/////////////////////////// end setup ////////////////////////////////////

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
        makeBarChart(prettyData, 0)
    })

function makeBarChart(data, n) {
    console.log(data)

    // define svg for barchart
    const svg2 = d3.select("#dashboard").append("svg")
        .attr("width", svgWidth)
        .attr('height', svgHeight)
        .attr("overflow", "visible")
        .attr('class', 'bar-chart')

    // genrate groups
    const g = svg2.selectAll(".group-bar")
        .data(data[n].continenten)
        .enter().append('g')
        .attr("class", "group-bar")

    // make scale
    const Yscale = d3.scaleLinear()
        .domain([0, d3.max(data[n].continenten, d => d.aantalObjInGebied)])
        .range([0, svgHeight])

    // make bars
    d3.select('.group-bar').selectAll('.bar')
        .data(data[n].continenten)
        .enter()
    g.append('rect')
        .attr('class', 'bar')
        .style('fill', 'rgb(166, 206, 227)')
        .attr('x', 25)
        .attr('y', function (d, i) {
            return i * verticalBarSpace
        })
        .attr('height', barHeight)
        .transition()
        .ease(d3.easeLinear)
        .duration(800)
        .attr("width", d => Yscale(d.aantalObjInGebied) + 1)

    //make tool tip with aantalopbjecten
    d3.select('.group-bar').selectAll('.bar-text')
        .data(data[n].continenten)
        .enter()
    g.append('text')
        .attr('class', 'bar-text')
        .text(d => d.aantalObjInGebied + " objecten")
        .attr('y', function (d, i) {
            return (i * verticalBarSpace) + barHeight / 2
        })
        .transition()
        .ease(d3.easeLinear)
        .duration(800)
        .attr('x', d => Yscale(d.aantalObjInGebied) + 50)

    // make labels
    d3.select('.group-bar').selectAll('.bar-label')
        .data(data[n].continenten)
        .enter()
    g.append('text')
        .attr('class', 'bar-label')
        .attr('text-anchor', "end")
        .text(d => d.gebiedLabel)
        .attr('x', 0)
        .attr('y', function (d, i) {
            return (i * verticalBarSpace) + barHeight / 2
        })

    // make dynamisch title
    svg2.append('text')
        .attr('class', 'bar-title')
        .text(data[n].categoryLabel)
        .attr('x', 25)
        .attr('y', -30)
        .style('font-size', '18')

    d3.selectAll('.bar').on("click", function (d, i) {
        //console.dir(this)
        continentNaam = this.__data__.gebiedLabel
        updatePieChart(data, continentNaam)
    })

}

function updateBarChart(data, n, color) {

    //console.log(data[n])
    // get scale from the biggest category
    const Yscale = d3.scaleLinear()
        .domain([0, d3.max(data[0].continenten, d => d.aantalObjInGebied)])
        .range([0, svgHeight])

    //update bars
    const bar = d3.selectAll('.bar')
        .data(data[n].continenten)

    bar.enter()
        .append('rect')
        .merge(bar)
        .style('fill', color)
        .attr('class', 'bar')
        .transition()
        .ease(d3.easeLinear)
        .duration(500)
        .attr("width", d => Yscale(d.aantalObjInGebied) + 1)

    bar.exit().remove()

    // update bar text (aantalobjecten)
    const barText = d3.selectAll('.bar-text')
        .data(data[n].continenten)

    barText.enter()
        .append("text")
        .merge(barText)
        .attr("class", "bar-text")
        .text(d => d.aantalObjInGebied + " objecten")
        .attr('x', d => Yscale(d.aantalObjInGebied) + 50)

    barText.exit().remove()

    // update label 
    const barLabel = d3.selectAll('.bar-label')
        .data(data[n].continenten)

    barLabel.enter()
        .append("text")
        .merge(barLabel)
        .attr("class", "bar-label")
        .text(d => d.gebiedLabel)
        .transition()
        .ease(d3.easeLinear)
        .duration(200)
        .attr('y', 220)
        .style("font-size", "3")
        .transition()
        .ease(d3.easeLinear)
        .duration(300)
        .delay(function (d, i) {
            return (i * 100) + barHeight / 2
        })
        .attr('y', function (d, i) {
            return (i * verticalBarSpace) + barHeight / 2
        })
        .style("font-size", "16")
        .attr('x', 0)

    barLabel.exit().remove()
    //update title
    d3.select('.bar-chart').select('.bar-title').text(data[n].categoryLabel);

}

function makePieChart(data) {
    // parse the  data
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
    svg.append('text')
        .attr('class', 'pie-title')
        .text("Totaal")
        .attr('x', -25)
        .attr('y', -240)
        .style('font-size', '18')

    d3.selectAll(".arc")
        .on("click", function () {
            //console.dir(this)
            categroieColor = this.childNodes[0].style.fill
            categorieNumber = this.__data__.index
            updateBarChart(data, categorieNumber, categroieColor)
            resetPieChart(data)
        })
}

// update pie-chart door de bar-chart
function updatePieChart(data, continentNaam) {
    //update data
    const updatedPie = d3.pie()
        .sort(null)
        .value(function (d) {
            const filterDataOpcontinentNaam = d.continenten.filter(item => item.gebiedLabel == continentNaam)
            const aantalObjectenPerContinent = filterDataOpcontinentNaam.map(item => item.aantalObjInGebied)
            return aantalObjectenPerContinent[0]
        });
    // update the paths
    d3.selectAll("path")
        .data(updatedPie(data))
        .attr("d", arc)
        .style("fill", function (d) {
            return color(d.data.categoryLabel)
        })
        // this transition came from http://bl.ocks.org/dbuezas/9306799
        .transition().duration(1000)
        .attrTween("d", function (d) {
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function (t) {
                return arc(interpolate(t));
            };
        })
    //update the title
    d3.select('.pie-title')
        .data(data)
        .text(function (d) {
            const filterDataOpcontinentNaam = d.continenten.filter(item => item.gebiedLabel == continentNaam)
            const NaamVanDeContinent = filterDataOpcontinentNaam.map(item => item.gebiedLabel)
            return NaamVanDeContinent[0]
        });
    // update the number on hover
    d3.selectAll('.aantalObjecten')
        .text(function (d) {
            const filterDataOpcontinentNaam = d.data.continenten.filter(item => item.gebiedLabel == continentNaam)
            const aantalObjectenPerContinent = filterDataOpcontinentNaam.map(item => item.aantalObjInGebied)
            return aantalObjectenPerContinent[0]
        });
}

// rest pie-cahrt en laat het totaal zien 
function resetPieChart(data) {
    const resetPie = d3.pie()
        .sort(null)
        .value(function (d) {
            return d.countObj
        });
    d3.selectAll("path")
        .data(resetPie(data))
        .attr("d", arc)
        .style("fill", function (d) {
            return color(d.data.categoryLabel)
        })
        // this transition came from http://bl.ocks.org/dbuezas/9306799
        .transition().duration(1000)
        .attrTween("d", function (d) {
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function (t) {
                return arc(interpolate(t));
            };
        })
    d3.select('.pie-title').text("Totaal");

    d3.selectAll('.aantalObjecten')
        .text(function (d) {
            return d.data.countObj
        });
}


// functie die zorgt dat alles op 0 staat voor dat de data binnen komt zodat de animatie werkt van de pie cahrt
//from https://www.youtube.com/watch?v=kK5kKA-0PUQ
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
    ORDER BY DESC(?choCount)
    LIMIT 5`;
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