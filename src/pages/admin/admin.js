import React, { useEffect, useState } from "react"
import "./styles.css"
import { Box, Button, CircularProgress, LinearProgress, Modal, Snackbar, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ChefHat, CircleArrowRight, Donut, LucideCircleArrowDown, LucideCircleArrowUp, LucideCircleFadingArrowUp, Package2 } from "lucide-react";
import UseGetOrdersBKP from "../../reducers/useGetOrdersBKP";
import UseGetCooks from "../../reducers/useGetCooks";
import UseAddCook from "../../reducers/useAddCook";
import UseAddDish from "../../reducers/useAddDish";
import ErrorBoundary from "../../utils/ErrorBoundary";

// Cook Modal Style
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '0px solid #000',
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
};


export default function AdminPage() {


  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false); // Modal State
  const [submittingData, setSubmittingData] = useState(false); // Loader triggered, when data submitting
  const [cookName, setCookName] = useState(""); // Gets cook name from input of ADD COOK Modal
  const [cookMobileNumber, setCookMobileNumber] = useState(0); // Gets cook mobile number from input of ADD COOK Modal
  let [mappedData, setMappedData] = useState([]); //  Get all Cooks from sheet, to check duplicates
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [dataSubmitted, setDataSubmitted] = useState(false) // Snackbar State - Snackbar triggered, when data submitted successfully
  const [openModalCookView, setOpenModalCookView] = useState(false);
  const [addNewDish, setAddNewDish] = useState({
    "ItemName": "",
    "Price": 0,
    "Availability": "Y",
    "BackgroundImage": ""
  })
  const [openDishModal, setOpenDishModal] = React.useState(false); // Modal State
  const [totalOrders, setTotalOrders] = useState([]);
  const [totalYesterdayOrders, setTotalYesterdayOrders] = useState([]);
  const [totalSalesToday, settotalSalesToday] = useState(0);
  const [totalSalesYesterday, setTotalSalesYesterday] = useState(0);
  const [isTileOneDataFetching, setIsTileOneDataFetching] = useState(true)
  const [isTileTwoDataFetching, setIsTileTwoDataFetching] = useState(true)

  let varTotalOrders, varCooks, todayOrder, yesterdayOrder, totalTodaysSales, totalYesterdaySales;

  const logicUnderGetTotalOrders = () => {
    setTotalOrders(varTotalOrders);

    todayOrder = varTotalOrders.filter((order) => order.orderedDateTime.toString().slice(0, 15) == new Date().toString().slice(0, 15))
    yesterdayOrder = varTotalOrders.filter((order) => order.orderedDateTime.toString().slice(0, 15) == (new Date(Date.now() - 864e5)).toString().slice(0, 15))

    console.log(todayOrder, "todayOrder", new Date())
    setTotalOrders(todayOrder)
    setTotalYesterdayOrders(yesterdayOrder)

    setIsTileOneDataFetching(false)

    totalTodaysSales = todayOrder.length && todayOrder.map(i => i.totalAmount).reduce((a, b) => parseInt(a) + parseInt(b))
    totalYesterdaySales = yesterdayOrder.length && yesterdayOrder.map(i => i.totalAmount).reduce((a, b) => parseInt(a) + parseInt(b))

    settotalSalesToday(totalTodaysSales)
    setTotalSalesYesterday(totalYesterdaySales)
    setIsTileTwoDataFetching(false)
  }


  const getTotalOrders = async () => {
    varTotalOrders = await UseGetOrdersBKP();
    logicUnderGetTotalOrders();
  }
  const getCookLists = async () => {
    varCooks = await UseGetCooks();
    setMappedData(varCooks)
  }

  useEffect(() => {
    getCookLists()
    getTotalOrders()
  }, [])


  const handleOpenCooks = async () => {
    setOpen(true)
    setSubmittingData(false)
    setCookMobileNumber(0)
    setCookName("")
    getCookLists()
  };

  const handleClose = () => {
    setOpen(false)
    setSubmittingData(false)
    setCookMobileNumber(0)
    setCookName("")
  };

  const addDataToExcel = async () => {
    setSubmittingData(true)
    await UseAddCook(cookMobileNumber, cookName).then((res) => {
      if (res == "SUCCESS") {
        setSnackbarMessage("Cook Added Successfully !!!!!!")
        setOpen(false)
        setSubmittingData(false)
        setDataSubmitted(true)
      }
    })
  }

  const addDishDataToExcel = async () => {
    setSubmittingData(true)
    await UseAddDish(addNewDish).then(res => {
      if (res == "SUCCESS") {
        console.log("DISH DATA ADDED")
        setSnackbarMessage("Dish Added Successfully !!!!!!")
        setOpenDishModal(false)
        setSubmittingData(false)
        setDataSubmitted(true)
      }
    })
  }

  const handleCloseDish = () => {
    setOpenDishModal(false)
    setSubmittingData(false)
    setAddNewDish({ "ItemName": "", "Price": 0, "Availability": "Y", "BackgroundImage": "" })
  }

  const handleOpenDish = () => {
    setOpenDishModal(true)
  }

  return (
    <>
    <ErrorBoundary fallback={<h1>Error occured</h1>}>
      <Snackbar
        open={dataSubmitted}
        autoHideDuration={4000}
        hidden={dataSubmitted}
        onClose={() => {
          setDataSubmitted(false)
          setSnackbarMessage("")
        }}
        message={snackbarMessage}
        
      />
      <div style={{ padding: "2vh", textAlign: "center", background: "rgba(255, 140, 0, 0.2)" }}>
        Restaurent name goes here
        <br />
        Address
      </div>
      <div className="mainHeading">
        <div className="mainHeadingTile">
          <span style={{ position: "absolute" }}><ChefHat className="svgStyleMainHeading" /></span>
          <h2>Cooks</h2>
          <div className="thinHorizontalLine">
            <Button className="mainHeadingButton" onClick={handleOpenCooks}>Add A Cook
              <CircleArrowRight style={{ marginLeft: "2px" }} />
            </Button>
            <Button hasError className="mainHeadingButton" onClick={() => {
              setMappedData([])
              getCookLists()
              setOpenModalCookView(true)
            }}>View Cooks
              <CircleArrowRight style={{ marginLeft: "2px" }} />
            </Button>
          </div>
        </div>
        <div className="mainHeadingTile">
          <span style={{ position: "absolute" }}><Donut  className="svgStyleMainHeading"/></span>
          <h2>Dishes</h2>
          <div className="thinHorizontalLine">
            <Button className="mainHeadingButton" onClick={handleOpenDish}>Add A Dish <CircleArrowRight style={{ marginLeft: "2px" }} /></Button>
            <Button className="mainHeadingButton" >View Dishes <CircleArrowRight style={{ marginLeft: "2px" }} /> </Button>
          </div>
        </div>
        <div className="mainHeadingTile">
          <span style={{ position: "absolute" }}><Package2  className="svgStyleMainHeading"/></span>
          <h2>Orders</h2>
          <div className="thinHorizontalLine">
            <Button className="mainHeadingButton" onClick={() => navigate("/")}>Place Order <CircleArrowRight style={{ marginLeft: "2px" }} /> </Button>
            <Button className="mainHeadingButton" onClick={() => navigate("/orders")}>Manage Orders <CircleArrowRight style={{ marginLeft: "2px" }} /> </Button>
          </div>
        </div>
      </div>
      <div className="insightsTile" style={{
        justifySelf: "left",
        margin: "-20px 20px",
        color: "rgb(255, 140, 0, 1)",
        fontWeight: "bold",
        textDecoration: "underline"
      }}>Today's Insights</div>
      <div className="insightsTile">
        <div className="tile">Total number of Orders <br /> placed today
          <div className="tileSpan">
            {isTileOneDataFetching ? <LinearProgress size={10} color={"white"} /> :
              <><span style={{fontSize:"20px"}}>{totalOrders.length}</span> &nbsp;
                <span style={totalOrders.length > totalYesterdayOrders.length ? { position: "relative", top: "5px", fontSize: "10px", color: "green" } : { position: "relative", top: "5px", fontSize: "10px", color: "red" }}>
                  {totalOrders.length > totalYesterdayOrders.length ? <LucideCircleArrowUp /> : <LucideCircleArrowDown />}&nbsp;
                </span>
                <span style={{ fontWeight: "normal", fontSize: "10px" }}><span style={{ fontWeight: "bold" }}>{totalYesterdayOrders.length} </span> on {new Date(Date.now() - 864e5).toString().slice(3, 15)}</span>
              </>}

          </div>

        </div>
        <div className="tile">Sales Today (in ₹)
          <div className="tileSpan">{isTileTwoDataFetching ? <LinearProgress size={10} color={"white"} /> :
            <><span style={{fontSize:"20px"}}>{totalSalesToday} </span> &nbsp;
              <span style={totalSalesToday > totalSalesYesterday ? { position: "relative", top: "5px", fontSize: "10px", color: "green" } : { position: "relative", top: "5px", fontSize: "10px", color: "red" }}>
                {totalSalesToday > totalSalesYesterday ? <LucideCircleArrowUp /> : <LucideCircleArrowDown />}&nbsp;
              </span>
              <span style={{ fontWeight: "normal", fontSize: "10px" }}><span style={{ fontWeight: "bold" }}>{totalSalesYesterday} </span> on {new Date(Date.now() - 864e5).toString().slice(3, 15)}</span>
            </>
          }</div>
          {/* "Rs. " + totalSalesToday */}
        </div>
        <div className="tile">Trending Dishes <br />(Based on orders)
          <div className="tileSpan">Chappathi, Adai</div>
        </div>

        <div className="tile">Cook that hold highest order
          <div className="tileSpan">Ganesh</div>
        </div>
        <div className="tile">Most Selling Item (Top 3)
          <div className="tileSpan">Chappathi, Adai, Poori</div>
        </div>
        <div className="tile">Customer Growth
          <div className="tileSpan">12% High</div>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>


        <div>
          {/* <Button onClick={handleOpenCooks}>Manage Cooks</Button> */}
          <Modal
            onClose={() => {
              setOpenModalCookView(false)
            }}

            open={openModalCookView}
          >

            <Box sx={style} style={{ width: "50%" }}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                View Cook
              </Typography>
              <div style={mappedData.length ? { display: "none" } : { textAlign: "center", margin: 10 }}><CircularProgress /> </div>
              <div style={!mappedData.length ? { display: "none" } : {
                flexDirection: "column",
                display: "flex",
                overflowX: "hidden",
                overflowY: "auto"
              }}>
                <div
                  style={{
                    flexDirection: "row",
                    padding: 10,
                    background: "rgba(10,10,10,0.05)",
                    display: "flex",
                    width: "97.5%",
                    justifyContent: "space-between"
                  }}
                // className={cookMobileNumber == data.MobileNumber ? "mappedDataStyle" : "mappedDataStyleNone"}
                >
                  <div>Name</div>
                  <div>Mobile Number</div>
                </div>
              </div>
              <div style={{
                flexDirection: "column",
                display: "flex",
                height: "300px",
                overflowX: "hidden",
                overflowY: "auto"
              }}>
                {mappedData.map((data, index) => {
                  return (
                    <>
                      <div
                        style={{
                          flexDirection: "row",
                          padding: 10,
                          background: index % 2 === 0 ? "rgba(10,10,10,0.05)" : "white",
                          display: "flex",
                          width: "97.5%",
                          justifyContent: "space-between"
                        }}
                      // className={cookMobileNumber == data.MobileNumber ? "mappedDataStyle" : "mappedDataStyleNone"}
                      >
                        <div>{data.Name}</div>
                        <div>{data.MobileNumber}</div>
                      </div>
                    </>
                  )
                })}
              </div>
            </Box>
          </Modal>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Add Cook
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}
                style={{ display: "flex", flexDirection: "row" }}>
                <TextField id="outlined-basic" onChange={e => setCookName(e.target.value)} label="Name" variant="outlined" /> &nbsp;&nbsp;
                <TextField id="outlined-basic" onChange={e => setCookMobileNumber(e.target.value)} label="Mobile Number" variant="outlined" />
              </Typography>
              <div>
                {mappedData.map((data) => {
                  return (
                    <>
                      <div className={cookMobileNumber == data.MobileNumber ? "mappedDataStyle" : "mappedDataStyleNone"}>
                        <div style={{ color: "red" }}>Cook Exists !!! </div>
                        <div>{data.Name}</div>
                        <div>{data.MobileNumber}</div>
                      </div>
                    </>
                  )
                })}
              </div>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}
                style={{ display: "flex", flexDirection: "row" }}>
                <Button disabled={cookName.length == 0 || cookMobileNumber.length !== 10} loading={submittingData} onClick={addDataToExcel}>SUBMIT</Button> &nbsp;&nbsp;
                <Button onClick={handleClose}>CLOSE</Button>

              </Typography>
            </Box>
          </Modal>
        </div>

        <div>
          {/* <Button onClick={handleOpenDish}>Manage Dishes</Button> */}
          <Modal
            open={openDishModal}
            onClose={handleCloseDish}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Add Dish
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}
                style={{ display: "flex", flexDirection: "column" }}>
                <TextField id="outlined-basic" onChange={e => setAddNewDish({ ...addNewDish, ItemName: e.target.value })} label="Dish Name" variant="outlined" /> &nbsp;&nbsp;
                <TextField id="outlined-basic" onChange={e => setAddNewDish({ ...addNewDish, Price: e.target.value })} label="Price" variant="outlined" /> &nbsp;&nbsp;
                <TextField id="outlined-basic" onChange={e => setAddNewDish({ ...addNewDish, BackgroundImage: e.target.value })} label="Background Image" variant="outlined" /> &nbsp;&nbsp;
              </Typography>
              <div style={{ color: "red", fontSize: 14, marginTop: -10 }}>
                Note: Please don't add COMMA (,) symbol in any fields.
              </div>
              <div>

              </div>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}
                style={{ display: "flex", flexDirection: "row" }}>
                <Button loading={submittingData} onClick={() => {
                  console.log("ADD NEW DISH", addNewDish)
                  addDishDataToExcel()
                }}>SUBMIT</Button> &nbsp;&nbsp;
                <Button onClick={handleCloseDish}>CLOSE</Button>

              </Typography>
            </Box>
          </Modal>
        </div>

        {/* <div>
          <Button onClick={() => navigate("/orders")}>Manage Orders</Button>
        </div> */}
      </div>
      </ErrorBoundary>
    </>
  )
}