//#region Imports
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Mail,
  Phone,
  Search,
  User,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import "./MainDataStyle.css"

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import axios from "axios";
import { CircularProgress, Input, Snackbar } from "@mui/material";
import { useNavigate } from "react-router-dom";
// import ReactWordcloud from "react-wordcloud";
import { UseGetTrendingOrders } from "../../reducers/useGetOrders";
//#endregion



//#region Column Helper for creating columns
const columnHelper = createColumnHelper();
const columns = [
  columnHelper.accessor("ID", {
    cell: (info) => info.getValue(),
    header: () => (
      <span className="flex items-center">
        <User className="mr-2" size={16} /> ID
      </span>
    ),
  }),

  columnHelper.accessor("Name", {
    cell: (info) => info.getValue(),
    header: () => (
      <span className="flex items-center">
        <User className="mr-2" size={16} /> Name
      </span>
    ),
  }),
  columnHelper.accessor("Email", {
    id: "email",
    cell: (info) => (
      <span className="italic text-blue-600">{info.getValue()}</span>
    ),
    header: () => (
      <span className="flex items-center">
        <Mail className="mr-2" size={16} /> Email
      </span>
    ),
  }),
  columnHelper.accessor("Designation", {
    header: () => (
      <span className="flex items-center">
        <Phone className="mr-2" size={16} /> Designation
      </span>
    ),
    cell: (info) => info.getValue(),
  }),
];

//#region Main Class Starts here
export default function MainData() {
  let arrData = []
  const navigate = useNavigate();

  const [data, setData] = useState([]); // For Dishes Table Data
  const [sorting, setSorting] = React.useState([]); // For Dishes Table Sorting Functionality
  const [globalFilter, setGlobalFilter] = React.useState(""); // For Dishes Table Filter Functionality
  const [submittingData, setSubmittingData] = useState(false); // Loader triggered, when data submitting
  const [mobileNumber, setMobileNumber] = useState(""); // Get Mobile Number to add GPAY
  const [validateMobileNumber, setValidateMobileNumber] = useState(false); // Validating mobile number for GPAY 
  const [orderedItems, setOrderedItems] = useState([]); // Ordered Dishes will be stored, when user selects
  const [trendingDishes, setTrendingDishes] = useState([]);
  const [searchDish, setSearchDish] = useState("");

  const [mappedDishData, setMappedDishData] = useState([]);

  const [dataSubmitted, setDataSubmitted] = useState(false) // Snackbar State - Snackbar triggered, when data submitted successfully
  const [openDishModal, setOpenDishModal] = React.useState(false); // Modal State
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [placeOrderButtonLoading, setPlaceOrderButtonLoading] = useState(false);


  const getMainDishes = async () => {
    const url = "https://script.google.com/macros/s/AKfycbypvDO7LqccspO7vwcRSY6NO7VEttkdKSbb5kaT2DjAgJsFBZkOS6DnWcolR-J_5KIoVA/exec"
    const data = await axios.get(url);
    let response = [], mappedDataTemp = []
    response = data.data;
    response = response.replace("`", "")
    response = response.split(",")
    console.log("GETMAINDISH", response);

    for (let length = 0; length < response.length;) {
      mappedDataTemp.push({
        "ID": response[length],
        "ItemName": response[length + 1],
        "Price": response[length + 2],
        "Availability": response[length + 3],
        "BackgroundImage": response[length + 4]
      })
      length += 5;
    }
    setMappedDishData(mappedDataTemp)
    setData(mappedDataTemp)
  }

  const getAvailabilityOnOrderedDish = async () => {
    const url = "https://script.google.com/macros/s/AKfycbypvDO7LqccspO7vwcRSY6NO7VEttkdKSbb5kaT2DjAgJsFBZkOS6DnWcolR-J_5KIoVA/exec"
    const data = await axios.get(url);
    let response = [], mappedDataTemp = []
    response = data.data;
    response = response.replace("`", "")
    response = response.split(",")
    console.log("GETMAINDISH", response);

    for (let length = 0; length < response.length;) {
      mappedDataTemp.push({
        "ID": response[length],
        "ItemName": response[length + 1],
        "Price": response[length + 2],
        "Availability": response[length + 3],
        "BackgroundImage": response[length + 4]
      })
      length += 5;
    }
    return mappedDataTemp
  }

  // To get trending dishes
  const getOrders = async () => {
    await UseGetTrendingOrders().then(orders => {
      setTrendingDishes([])
      setTrendingDishes(orders)
    })
  }

  useMemo(async () => {
    console.log("Called Before call,,,, useefect");
    // fetch(
    //   "https://api.sheetbest.com/sheets/5d6f5a1d-4334-47cd-b4fe-2239e27d5645?_raw=1"
    // )
    //   .then((response) => response.json())
    //   .then((data) => {
    //     setData(data)
    //     // console.log("DATAAAA success", data)
    //     // return data;
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });
    getMainDishes()
    getOrders()
    // setData(mockData)
  }, [])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
    getCoreRowModel: getCoreRowModel(),

    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),

    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
  });



  const placeOrder = async () => {
    setPlaceOrderButtonLoading(true)
    const url = "https://script.google.com/macros/s/AKfycbzrv2iMRbEas4GKtwuPCyUh8GsgE6IZ3zwG1ImRn8Eq3wFMTutcbrNsgt2i3TkZ9Y1SEQ/exec"
    const data = await axios.get(url);
    let response = [], mappedDataTemp = []
    response = data.data;
    response = response.split(",")

    let updatedDishes = await getAvailabilityOnOrderedDish()
    console.log(updatedDishes, "updateddishes")

    let orderAvailabilityStatus = []
    orderedItems.map(item => {
      console.log("items", item.Availability)
      updatedDishes.map(dish => {
        if (dish.ItemName === item.ItemName) {
          orderAvailabilityStatus.push(dish.Availability.toString().toUpperCase())
        }
      })
    })
    console.log("ORDER AVAILABILITY", orderAvailabilityStatus)
    if (orderAvailabilityStatus.includes("n".toUpperCase())) {
      console.log("ORDER CANNOT BE PLACED")
      setSnackbarMessage("Cannot Place Order. Item Unavailable. Please try after sometimes")
      setPlaceOrderButtonLoading(false)
      setDataSubmitted(true)
    } else {
      for (let length = 0; length < response.length;) {
        mappedDataTemp.push({ "MobileNumber": response[length], "Name": response[length + 1], "OrderCount": parseInt(response[length + 2]) })
        length += 3;
      }
      console.log("MAPPED", mappedDataTemp)
      let sorted = mappedDataTemp.sort((a, b) => a.OrderCount - b.OrderCount)
      console.log("SORTED", sorted)

      if (Object.values(sorted)[0].OrderCount < 3) {

        const urlToUpdateOrderCount = "https://script.google.com/macros/s/AKfycbyka4hS9lW_Lf-IvFt63MTAg3fpM9GGeruwG9m1gKyd80jP552ZaSp4jdp0DKcjruxkNw/exec"
        const url = "https://script.google.com/macros/s/AKfycbyWSmD6GZTw1MMBGQ1w1mP5Yn64nk-Lp2wgYYGOYaAkD1m9UJDOPggYXUlkVhzJ0wEvew/exec";

        let minifyOrderItem = []
        orderedItems.map(items => {
          minifyOrderItem.push({
            "ItemName": items.ItemName,
            "Quantity": items.quantity
          })
        })

        console.log(Object.values(sorted)[0].MobileNumber)
        fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: (`MobileNumber=${Object.values(sorted)[0].MobileNumber}&OrderId=${new Date().getTime()}&OrderedItems=${JSON.stringify(minifyOrderItem).replaceAll(",", "#@#@#")}&OrderedDate=${new Date()}&TotalAmount=${orderedItems.reduce((sum, p) => sum + (p.Price * p.quantity), 0)}`)
        }).then(res => res.text()).then(data => {
          console.log("Order DATA ADDED", data)
          setSnackbarMessage("Order Placed Successfully !!!!!!")
          getOrders()
          setOpenDishModal(false)
          // setSubmittingData(false)
          setDataSubmitted(true)
          getMainDishes()
        }).catch((error) => console.log("ERROR", error))

        fetch(urlToUpdateOrderCount, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: (`CookId=${Object.values(sorted)[0].MobileNumber}&Action=PLACE`)
        }).then((res) => res.text()).then(data => {
          console.log("Order DATA updated", data)
        })
        setOrderedItems([])
        setPlaceOrderButtonLoading(false)
      } else {
        setDataSubmitted(true)
        setSnackbarMessage("Cooks are unavailable right now. Please make an order after sometimes. Sorry for inconvenience :(")
        setPlaceOrderButtonLoading(false)
      }

    }
  }

  const fnSearchDish = (e) => {

    // setData(data.filter((d)=>d.ItemName.toLowerCase().includes(e.target.value.toLowerCase())))

  }




  return (
    <div>

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
      <div style={validateMobileNumber ? { padding: "10px 20px", display: "grid", justifyContent: "center", alignItems: "center", placeContent: "center", top: "50%", bottom: "50%", textAlign: "center", backgroundColor: "#00550000" } : { display: "none" }}>
        <div style={{ fontWeight: "900" }}>Enter Mobile number for Payment (Gpay)</div>
        <div>
          <input style={{ marginTop: 40, padding: 5, textAlign: "center", width: "90%" }} value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} />
        </div>
        <div>
          <input type="button" value="Submit" style={{ backgroundColor: "white", color: "black", marginTop: 10, height: "25px" }}
            onClick={() => { setValidateMobileNumber(mobileNumber.toString().length === 10) }} />
        </div>

      </div>




      <div style={{ display: "flex", flexDirection: "row" }}>

        <div style={!validateMobileNumber ? {} : { display: 'none' }} className="home-container">
          {!data.length && <div style={{ display: "flex", placeContent: "center" }}><CircularProgress /></div>}
          {/* <div style={data.length ? {display:"flex"}:{display:"none"}}>
            <TextField className="searchDish" onChange={e=>fnSearchDish(e)} label="Name" variant="outlined" /> &nbsp;&nbsp;
          </div> */}
          <div className="container">
            <div className="grid-container">
              {data.map((category, index) => (
                <div

                  background={category.BackgroundImage}
                  style={category.Availability.toString().toUpperCase() == "Y" ?
                    { display: "flex", background: "white", color: "white" } : { display: 'none' }} key={index} className={`featured ${category.ItemName}`}>
                  <div id={`img${index + 1}`}
                    className="lil-overlay"
                    style={{ background: "linear-gradient(rgba(255,255,255,0.9), rgba(200,200,200,0.5)), url(" + category.BackgroundImage + ")", backgroundRepeat: "round" }}
                  >
                    <input type="number" min={1} style={{ margin: "30px 8px", marginTop: "50px", width: "30%" }}
                      onChange={(e) => {
                        orderedItems.map((eachOrderedItem, index) => {
                          if (e.target.value === "" && eachOrderedItem.ItemName === category.ItemName) {
                            let arrIndex = orderedItems.indexOf(orderedItems.ItemName)
                            console.log("INDEX", arrIndex, category.ItemName, index);
                            let arrOrder = orderedItems;
                            arrOrder.splice(index, 1)
                            setOrderedItems([...arrOrder])
                          }
                          else if (eachOrderedItem.ItemName == category.ItemName) {
                            let arrOrder = orderedItems;
                            arrOrder.splice(index, 1)
                            setOrderedItems([...arrOrder])
                          }
                        })
                        data.map((eachData) => {
                          if (eachData.ItemName == category.ItemName && e.target.value !== "") {
                            let arrOrder = orderedItems;
                            arrOrder.push({
                              ...category,
                              quantity: e.target.value
                            })
                            setOrderedItems([...arrOrder])
                          }
                        })
                        console.log("Category : ", orderedItems)
                      }
                      }
                    />
                  </div>
                  <p className="main-description" style={{ color: "black", textShadow: "0px 0px 5px white" }}>{category.ItemName}</p>
                  <p className="main-price" style={{ color: "black", textShadow: "0px 0px 5px white" }}>Rs.{category.Price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={!validateMobileNumber && !orderedItems.length ? {} : { display: 'none' }} className="home-container-ordered">
          <div style={{ padding: 15, fontWeight: "600", textAlign: "center", fontFamily: "cursive" }}>
            Top Trending Dishes in our Hotel
            {/* <div>
              <ReactWordcloud words={trendingDishes} /> 
            </div> */}
            <div style={{ marginTop: 30 }}>
              {
                trendingDishes.map(dish => {
                  return (
                    <>
                      <div style={{ fontWeight: "normal", textAlign: "left", marginLeft: 30 }}>
                        {dish.ItemName}
                      </div>
                    </>
                  )
                })
              }
            </div>
          </div>
        </div>
        <div style={!validateMobileNumber && orderedItems.length ? {} : { display: 'none' }} className="home-container-ordered">
          <div style={{ textAlign: "center", padding: "10px 10px", fontWeight: "700" }} >ORDERED ITEMS</div>
          <div style={{ display: "flex", alignItems: "flex-end", padding: "10px 10px" }}>
            <div>
              {/* {orderedItems.length} */}
              <div style={{ display: "flex", flexDirection: "row", fontWeight: "bold" }}>
                <div style={{ padding: "0px 15px" }}>
                  #
                </div>
                <div >
                  Name
                </div>
                <div style={{ right: "200px", position: "absolute" }} >
                  Quantity
                </div>
                <div style={{ right: "125px", position: "absolute" }} >
                  Price
                </div>
                <div style={{ right: "30px", position: "absolute" }}>
                  Amount
                </div>

              </div>
              {orderedItems && orderedItems.map((item, index) => {
                return (
                  <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <div style={{ padding: "0px 15px", alignContent: "space-evenly" }}> {++index}
                    </div>
                    <div className="orderedItemNames">
                      {item.ItemName}
                      {/* ({item.quantity}) */}
                    </div>

                    <div style={{ right: "200px", position: "absolute", alignSelf: "anchor-content" }} >
                      {item.quantity}
                    </div>
                    <div style={{ right: "125px", position: "absolute", alignSelf: "anchor-content" }} >
                      {item.Price}
                    </div>
                    <div style={{ right: "30px", position: "absolute", alignSelf: "anchor-content" }}>
                      {item.quantity * item.Price}
                    </div>
                  </div>
                )

              })}
            </div>
          </div>

          <div style={{ textAlign: "center", borderTop: "1px solid black", margin: "10px 15px" }}>
            <span>Total: </span>
            <span style={{ fontWeight: 600 }}> Rs. {orderedItems.reduce((sum, p) => sum + (p.Price * p.quantity), 0)} </span>
          </div>


          <div>
            <Button
              loading={placeOrderButtonLoading}
              loadingIndicator={< CircularProgress color="primary" size={16} />}
              style={{
                display: "flex",
                justifySelf: "center",
                fontWeight: "bold",
                color: "green",
                border: "2px solid green",
                padding: "5px 20px",
                borderRadius: "10px",
                marginTop: "25px",
                placeSelf: "center"
              }}
              onClick={placeOrder}
            >
              {!placeOrderButtonLoading ? "Make an Order" : <span>Please Wait</span>}
            </Button>
          </div>
          {/* <GooglePayButton
            environment="TEST"
            buttonType="buy"
            buttonLocale="PAY TG"
            paymentRequest={{
              apiVersion: 2,
              apiVersionMinor: 0,
              allowedPaymentMethods: [
                {
                  type: 'CARD',
                  parameters: {
                    allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                    allowedCardNetworks: ['MASTERCARD', 'VISA'],
                  },
                  tokenizationSpecification: {
                    type: 'PAYMENT_GATEWAY',
                    parameters: {
                      gateway: 'example',
                      gatewayMerchantId: 'exampleGatewayMerchantId',
                    },
                  },
                },
              ],
              merchantInfo: {
                merchantId: '12345678901234567890',
                merchantName: 'Demo Merchant',
              },
              transactionInfo: {
                totalPriceStatus: 'FINAL',
                totalPriceLabel: 'Total',
                totalPrice: '0.001',
                currencyCode: 'USD',
                countryCode: 'US',
              },
            }}
            onLoadPaymentData={paymentRequest => {
              console.log('load payment data', paymentRequest);
            }}
          /> */}
        </div>



      </div>
      <div style={{ display: "none" }}>
        {/* className="menuItemGroupedMain"> */}
        {data.map(eachData => {
          return (
            <div>
              {/* className="itemNameGrouped"> */}
              <div >
                {eachData.ItemName}

              </div>
              <div>
                {eachData.Price}
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ display: "none" }}>
        {/* Global Search */}
        <div className="mb-4 relative">
          <input
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
        </div>

        {/* Header */}
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup && headerGroup.headers && headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? "cursor-pointer select-none flex items-center"
                            : "",
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        <ArrowUpDown className="ml-2" size={14} />
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {table && table.getRowModel() && table.getRowModel().rows && table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                    //   className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cell content */}
        <div>
          {table && table.getRowModel() && table.getRowModel().rows && table.getRowModel().rows.map((row) => (
            <>
              {row.getVisibleCells().map((cell) => (
                <div
                  key={cell.id}
                  style={{ display: "flex", flexDirection: "row" }}
                //   className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </div>
              ))}
            </>
          ))}
        </div>

        {/* Items per page and Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 text-sm text-gray-700">
          <div className="flex items-center mb-4 sm:mb-0">
            <span className="mr-2">Items per page</span>
            <select
              className="border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2"
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
            >
              {[5, 10, 20, 30].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <button
              className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeft size={20} />
            </button>

            <button
              className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft size={20} />
            </button>

            <span className="flex items-center">
              <input
                min={1}
                max={table.getPageCount()}
                type="number"
                value={table.getState().pagination.pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  table.setPageIndex(page);
                }}
                className="w-16 p-2 rounded-md border border-gray-300 text-center"
              />
              <span className="ml-1">of {table.getPageCount()}</span>
            </span>

            <button
              className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight size={20} />
            </button>

            <button
              className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <ChevronsRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}