import React , { Suspense } from 'react';
import './App.css';
import store from "./Redux/store";
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Link , Switch } from "react-router-dom";
const Home = React.lazy(() => import('./components/Home'));
const UploadPcr = React.lazy(() => import('./components/UploadPcr'));
const ShowPcr = React.lazy(() => import('./components/ShowPcr'));
const Pcrprocess = React.lazy(() => import('./components/Pcrprocess'));

function App() {
  return (

    <Provider store = {store}>
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
        <Route  component={Home}></Route>
          <Switch>
            
            <Route  path="/uploadpcr" component = {UploadPcr}></Route>
            <Route  path="/showpcr" component = {ShowPcr}></Route>
            <Route  path="/pcrprocess" component = {Pcrprocess}></Route>
          </Switch>
        </Suspense>
      </BrowserRouter>
    </Provider>

  );
}

export default App;
