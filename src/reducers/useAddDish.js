export default function UseAddDish(addNewDish) {
    return new Promise((resolve, error) => {
        const url = "https://script.google.com/macros/s/AKfycbxsSRoIO7yqQxEksppaCXRIpo0fqGgu0mU5rEetvaFu-KwTtnr6yJQBGdsKR96gHFRdrA/exec";
        fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: (`ItemName=${addNewDish.ItemName}&Price=${addNewDish.Price}&Availability=${addNewDish.Availability}&BackgroundImage=${addNewDish.BackgroundImage}`)
        }).then(res => res.text()).then(data => {
           resolve("SUCCESS")
        }).catch((err) =>  error("FAILED"))
    })
}