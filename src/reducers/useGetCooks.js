import axios from "axios";


export default async function UseGetCooks(){
    const url = "https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLjXjPHddHt2mJIITI0lxU_vmJ9KFzpVnNEY2B8cLgkxtqgfkV2uKRMOYtqwivcql3v9TuWIpX4nZBP_ZmSCDyMP3aRmA_RyP829rlX56cbtt8CmDcLQ3ia6XRTSiKMfY4NpHjSMo9gaBSeSTn1paKlhQNUCP5WiuHh3S8g2rG2l_j1zX4HXwKmMVGb0BJ-teIPjBV64v0uXGD-1B4msRUsnqyd8z8u0hfYHWR-IYNSkyk8u6lZ_hDkAD5fq6-o9mB8IPNQskPzqgP1GGhqSoxJ-hhbijuLCB-StE4sA&lib=MWqiROwn6LlUSLlEPtsRpleBfCJXv4Til"
        const data = await axios.get(url);
        let response = [], mappedDataTemp = []
        response = data.data;
        response = response.split(",")
        for (let length = 0; length < response.length;) {
          mappedDataTemp.push({ "MobileNumber": response[length], "Name": response[length + 1] })
          length += 2;
        }
        return mappedDataTemp;
}