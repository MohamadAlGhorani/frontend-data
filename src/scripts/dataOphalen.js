import {
    runQuery
} from './runQuery.js'
import {
    loopData
} from './transformData.js'
import {
    makePieChart
} from './makePieChart.js'
import {
    makeBarChart
} from './makeBarChart.js'

const eindpoint =
    "https://api.data.netwerkdigitaalerfgoed.nl/datasets/ivo/NMVW/services/NMVW-22/sparql";
const categoryQuery = `
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

runQuery(eindpoint, categoryQuery)
    .then(loopData)
    .then(prettyData => {
        makePieChart(prettyData);
        makeBarChart(prettyData, 0);
    });

export {
    runQuery,
    eindpoint
}