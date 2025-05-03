const DeliverOrder = (order) => {
    return new Promise(async (resolve, error) => {
        try {
            const urlToUpdateOrderCount = "https://script.google.com/macros/s/AKfycbyka4hS9lW_Lf-IvFt63MTAg3fpM9GGeruwG9m1gKyd80jP552ZaSp4jdp0DKcjruxkNw/exec"
            const url = "https://script.google.com/macros/s/AKfycbyWDCxh23KCF2zbkNlyJyg0JUDzFcSy6NbZb7wVGFwzYXA0XdyVzn4flo-XMEeGwrVA6Q/exec"

            fetch(urlToUpdateOrderCount, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: (`CookId=${order.cookID}&Action=DELIVER`)
            }).then((res) => res.text()).then(data => {
                console.log("Order DATA updated", data)
            })

            fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: (`OrderId=${order.orderID}`)
            }).then(res => res.text()).then(data => {
                resolve("Order Delivered Successfully")
            })
        }
        catch (err) {
            error(err)
        }
    })
}

export {
    DeliverOrder
}