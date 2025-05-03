import {React, useState} from 'react'
import axios from 'axios'


export default function Form(){
    
    // form states
    const [name, setName] = useState("")
    const [age, setAge] = useState("")
    const [designation, setDesignation] = useState("")
    const [salary, setSalary] = useState("")

    // submit events
    const handleSubmit = (e) => {
        e.preventDefault();
        // alert(name +"---"+ age +"---"+ designation + "---"+ salary)

        const data = {
            Name: name,
            Age: age,
            Designation: designation,
            Salary: salary
        }

        axios.post('https://api.sheetbest.com/sheets/5d6f5a1d-4334-47cd-b4fe-2239e27d5645',data).then((response)=>{
            console.log("Response: ", response )
            setName("")
            setAge("")
            setDesignation("")
            setSalary("")
        })
    }


    return(
        <div className="container">
            <br /> 
            <h1>Save form data in google sheets using React</h1>
            <br /> <br />

            {/* Forms */}
            <form autoComplete="off" className="form-group" onSubmit={handleSubmit}>
                
                <label>Name</label>
                <input type="text" placeholder="Enter your name" required className="form-control"
                onChange={(e)=>setName(e.target.value)} value={name} />
                <br/><br/>
                
                <label>Age</label>
                <input type="text" placeholder="Enter your age" required className="form-control"
                onChange={(e)=>setAge(e.target.value)} value={age} />
                <br/><br/>
                
                <label>Designation</label>
                <input type="text" placeholder="Enter your designation" required className="form-control"
                onChange={(e)=>setDesignation(e.target.value)} value={designation}/>
                <br/><br/>
                
                <label>Salary</label>
                <input type="text" placeholder="Enter your salary" required className="form-control"
                onChange={(e)=>setSalary(e.target.value)} value={salary}/>
                <br/><br/>

                <div style={{display:"flex", justifyContent:"flex-end"}}>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </div>



            </form>
        </div>
    )

}