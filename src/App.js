import { BrowserRouter, Route, Link, Redirect, Switch } from 'react-router-dom'
import './app.css'
import Home from './pages/Home'
import Post from './pages/Post'
import MainHeader,{BackToTop} from './pages/Common'
import React from 'react'
import History from './pages/History'
import ScrollToTop from './components'

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop>
        <div className="App">
          <MainHeader></MainHeader>
          <BackToTop></BackToTop>
          <Switch>
            <Route path="/history" component={History}></Route>
            <Route path="/post/:id" component={Post}></Route>
            <Route exact path="/" component={Home}></Route>
          </Switch>
        </div>
      </ScrollToTop>
    </BrowserRouter>
  );
}


export default App;
