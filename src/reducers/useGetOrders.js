import axios from "axios";


const UseGetOrders = () => {
    return new Promise(async (resolve, error) => {
        try {
            const url = "https://script.google.com/macros/s/AKfycbzQVOQcxId2aFVtEV_Yzzsn6nCtt7OXSzdBTbDtUUIqsgYy-_P7M8q8GVcwCCy_Vl9sMQ/exec"
            const data = await axios.get(url);
            let response = [], mappedDataTemp = []
            response = data.data;
            console.log("RESPONSE BEFORE", response)
            response = response && response.split(",")
            console.log("RESPONSE OF ORDERS", response)
            let eachElement = [];
            for (let length = 0; length < response.length;) {
                eachElement.push({
                    "id": response[length],
                    "cookID": response[length + 1],
                    "orderID": response[length + 2],
                    "orderedItem": JSON.parse(`${response[length + 3]}`.replaceAll("#@#@#", ",")),
                    "orderedDateTime": response[length + 4],
                    "totalAmount": response[length + 5]
                })
                length += 6;

            }
            console.log("eachElementeachElementeachElement", eachElement)
            resolve(eachElement);
        }
        catch (err) {
            error(err)
        }
    })
}

const UseGetTrendingOrders = () => {
    return new Promise(async (resolve, error) => {
        try {
            const url = "https://script.google.com/macros/s/AKfycbzQVOQcxId2aFVtEV_Yzzsn6nCtt7OXSzdBTbDtUUIqsgYy-_P7M8q8GVcwCCy_Vl9sMQ/exec"
            const data = await axios.get(url);
            let response = [], mappedDataTemp = []
            response = data.data;
            console.log("RESPONSE BEFORE", response)
            response = response && response.split(",")
            console.log("RESPONSE OF ORDERS", response)
            let eachElement = [];
            for (let length = 0; length < response.length;) {
                eachElement.push({
                    "orderedItem": JSON.parse(`${response[length + 3]}`.replaceAll("#@#@#", ","))
                })
                length += 6;

            }
            let ordereditemsToSort = []
            eachElement.map(element => {
                ordereditemsToSort.push(...element.orderedItem)
            })
            let sorted = ordereditemsToSort.sort((a, b) => b.Quantity - a.Quantity)
            let removeDuplicates = sorted.filter((o, index, sorted) => sorted.findIndex(item => JSON.stringify(item.ItemName) === JSON.stringify(o.ItemName)) === index).slice(0, 5)
            resolve(removeDuplicates)
        }
        catch (err) {
            error(err)
        }
    })
}

export {
    UseGetOrders,
    UseGetTrendingOrders
}