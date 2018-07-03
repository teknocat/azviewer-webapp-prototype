import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import App from './containers/App';
import Dashboard from './containers/Dashboard';
import ContentView from './components/ContentView';
import Login from "./containers/auth/Login";
import GuestOnly from "./containers/auth/GuestOnly";
import UserOnly from "./containers/auth/UserOnly";

export default function getRoutes() {
  return (
    <Route path="/" component={App}>
      <Route component={GuestOnly}>
        <Route path="/login" component={Login} />
      </Route>

      <IndexRoute component={Dashboard}/>
      <Route path="/" component={Dashboard} />

      <Route path="/works" component={Dashboard}>
        <Route path="/works/:workId" component={ContentView}/>
      </Route>
      <Route path="/works/category/row/:worksRowKey" component={Dashboard}/>
      <Route path="/works/category/:worksCategoryKey" component={Dashboard}/>

      <Route path="/people" component={Dashboard}/>
      <Route path="/people/category/row/:peopleRowKey" component={Dashboard}/>
      <Route path="/people/category/:peopleCategoryKey" component={Dashboard}/>
      <Route path="/people/:personId" component={Dashboard}/>

      <Route component={UserOnly}>
        <Route path="/favorites" component={Dashboard}>
          <Route path="/favorites/:favoriteId" component={ContentView}/>
        </Route>
      </Route>

      <Route path="/search" component={Dashboard} />
    </Route>
  );
}
