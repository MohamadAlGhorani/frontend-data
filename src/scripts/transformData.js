import {
    getGeoQueryForCategory
} from './getContinents.js'
import {
    runQuery
} from './runQuery.js'
import {
    eindpoint
} from './dataOphalen.js'


function loopData(data) {
    return data
        .map(item => {
            return {
                category: `<${item.category.value}>`,
                categoryLabel: item.categoryLabel.value,
                countObj: item.choCount.value
            };
        })
        .reduce(async (newData, currentItem) => {
            const dataToReturn = await newData;
            const continentenVoorCurrentItem = await runQuery(
                eindpoint,
                getGeoQueryForCategory(currentItem.category)
            ).then(data => {
                return data.map(item => {
                    return {
                        gebiedLabel: item.continentLabel.value,
                        aantalObjInGebied: Number(item.choCount.value)
                    };
                });
            });

            currentItem.continenten = continentenVoorCurrentItem;
            dataToReturn.push(currentItem);
            return dataToReturn;
        }, []);
}

export {
    loopData
}