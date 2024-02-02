import {lazy} from 'react';
import ReactDOM from 'react-dom/client';
import './globals.scss';
import { BrowserRouter,Navigate,Route,Routes} from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';


import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary"
import { ErrorElement } from './components/ErrorElement/ErrorElement';

import {Home} from "./pages/page"
import {Layout} from './pages/layout';
import { AdminRouter } from './pages/panel/admin/router';
import { Shop } from './pages/shop/page';
import {Login} from "./pages/login/page"
import { Product } from './pages/product/page';
import { Cart } from './pages/cart/page';
import { Checkout } from './pages/cart/checkout/page';
import { NotFound } from './components/NotFount/NotFound';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
      <ErrorBoundary fallback={<ErrorElement/>}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout/>}>
              <Route index element={<Home/>}/>
              <Route path={"panel/login"} element={<Login/>}/>
              <Route path={"panel/admin/*"} element={<AdminRouter/>} />
              <Route path={"shop/:section_id"} element={<Shop/>} />
              <Route path={"product/:item_id"} element={<Product/>}/>
              <Route path={"cart"} element={<Cart/>}/>
              <Route path={"cart/checkout"} element={<Checkout/>}/>
              <Route path={"/notfound"} element={<NotFound/>}/>
              <Route path={"*"} element={<Navigate to="/notfound"/>}/>
            </Route>
          </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  </Provider>
  
    
);

