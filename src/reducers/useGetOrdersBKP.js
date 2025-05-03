import axios from "axios";


export default async function UseGetOrdersBKP(){
    try{
        const url = "https://script.google.com/macros/s/AKfycbz7I18zPA-CuTbzaWcIMv8t9zVpgOPKryqDThTUwg5BL5gThcLZ3q6sYLp4IQ84AIZUjg/exec"
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
        console.log("eachElementeachElementeachElement",eachElement)
        return eachElement;

    }
    catch{
        throw new Error("ERROR OCCURED IN REDUCER")
    }
}