export default function UseAddCook (cookMobileNumber, cookName) {
    return new Promise((resolve,error)=>{
        const url = "https://script.google.com/macros/s/AKfycbyPtnCAN48-wzBLMqcRGHqBfTDXVdfvMGn2iE-TrjrUZpnxm_-htz1uoj0SKCakL-Cq3Q/exec"
        fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: (`MobileNumber=${cookMobileNumber}&Name=${cookName}`)
        }).then(res => res.text()).then(data => {
            resolve("SUCCESS");
        }).catch((errorr) => error("FAILED"))
    })
   
}