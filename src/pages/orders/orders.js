import axios from "axios";
import React, { useEffect, useState } from "react"
import "./styles.css"
import { Button, CircularProgress, Snackbar } from "@mui/material";
import { UseGetOrders } from "../../reducers/useGetOrders";
import { DeliverOrder } from "../../reducers/useDeliverOrder";

export default function CookMappedOrders() {

    const [orderedDishes, setOrderedDishes] = useState([]);
    const [submittingData, setSubmittingData] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [dataSubmitted, setDataSubmitted] = useState(false) // Snackbar State - Snackbar triggered, when data submitted successfully
    const [isFetchingData, setIsFetchingData] = useState(true);
    const getOrders = async () => {
        setOrderedDishes([])
        setIsFetchingData(true)
        await UseGetOrders().then(orders => {
            setOrderedDishes(orders)
            setIsFetchingData(false)
            console.log("ELEMENT TO BE DISPLAYED", orders);
        })
    }
    useEffect(() => {
        getOrders()
    }, [])

    const deliverOrder = async (order) => {
        setSubmittingData(true)
        await DeliverOrder(order).then((status)=>{
            setDataSubmitted(true)
            setSnackbarMessage("Order Delivered Successfully !!!!!!")
        }).then(()=>{getOrders()})
    }

    return (
        <>
            <Snackbar
                open={dataSubmitted}
                autoHideDuration={5000}
                hidden={dataSubmitted}
                onClose={() => {
                    setDataSubmitted(false)
                    setSnackbarMessage("")
                }}
                message={snackbarMessage}
            />
            <Button onClick={getOrders}>Refresh</Button>
            <hr />
            <div>
                {(!isFetchingData && orderedDishes.length === 0) ?
                    <>
                        <div class="divOrderEmpty">Order Empty !!!</div>
                    </> : null}
            </div>
            <div >
                <div style={isFetchingData ? {
                    display: "flex",
                    placeItems: "center",
                    flexDirection: "column",
                    fontWeight: "bold",
                    color: "rgb(25, 118, 210)",
                    justifyContent: "center"
                } : { display: "none" }}>
                    <CircularProgress /> <br />
                    <div>Orders are being fetched... Please wait !!!</div>
                </div>
                <div className={isFetchingData || orderedDishes.length === 0 ? "displayNone" : "rowOrderedItemsHeader"}>
                    <div style={{ width: "10%" }}>Order ID</div>
                    <div style={{ width: "10%" }}>Action</div>
                    <div style={{ width: "10%" }}>Cook ID</div>
                    <div style={{ width: "20%" }}>Ordered Date & Time</div>
                    <div style={{ width: "10%" }}>Ordered Item/s</div>
                </div>
                {orderedDishes && orderedDishes.map((order, id) => {
                    return (
                        <div className="rowOrderedItems">
                            <div style={{ width: "10%" }}>
                                {order.orderID}
                            </div>

                            <div style={{ width: "10%" }}>
                                <Button className="deliverButton" onClick={deliverOrder.bind(this, order, id)}>
                                    Deliver
                                </Button>
                            </div>
                            <div style={{ width: "10%" }}>
                                {order.cookID}
                            </div>
                            <div style={{ width: "20%" }}>
                                {new Date(order.orderedDateTime).toGMTString("en-US").replace(",", "").replace("GMT", "")}
                                {/* <br/>
                        {new Date().toGMTString("en-US")}    */}
                            </div>
                            <div style={{ width: "20%", display: "none" }}>
                                {Math.floor(((new Date(order.orderedDateTime) - new Date()) % (1000 * 60 * 60)) / (1000 * 60))}
                                {/* {/1000} */}
                                {/* {new Date(order.orderedDateTime) - new Date()/1000} */}
                            </div>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                {order.orderedItem.map((dish) => {
                                    return (
                                        <div>
                                            {dish.ItemName} ({dish.Quantity})
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )

                })}
            </div>

        </>
    )
}