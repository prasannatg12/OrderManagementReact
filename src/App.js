import './App.css';
import './index.css'
import MockData from './pages/customerOrderPage/MainData';
import { BrowserRouter, Switch, Route, Redirect, createBrowserRouter, RouterProvider, Routes } from 'react-router-dom';
import CookMappedOrders from './pages/orders/orders';
import AdminPage from './pages/admin/admin';
import ErrorBoundary from './utils/ErrorBoundary';

function App() {
  return (
    <>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MockData />} />
            <Route path="/orders" element={<CookMappedOrders />} />
            <Route path="/admin" element={<ErrorBoundary fallback="ERROR CHECK"><AdminPage /></ErrorBoundary>}  />
          </Routes>

        </BrowserRouter>
        {/* <MockData /> */}
        {/* <Hooks /> */}
        {/* <div className="App"> */}
        {/* <header className="App-header"> */}
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        {/* <p> */}
        {/* Edit <code>src/App.js</code> and save to reload. */}
        {/* </p> */}
        {/* <a */}
        {/* className="App-link" */}
        {/* href="https://reactjs.org" */}
        {/* target="_blank" */}
        {/* rel="noopener noreferrer" */}
        {/* > */}
        {/* Learn React */}
        {/* </a> */}
        {/* </header> */}
        {/* </div> */}
    </>
  );
}

export default App;
