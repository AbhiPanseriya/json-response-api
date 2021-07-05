import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Auth from './auth/Auth';
import PrivateRoute from './utils/PrivateRoute';
import Home from './components/Home'
import CreateNew from './components/CreateNew';
import UpdateData from './components/UpdateData';

function App() {
  return (
    <div className="App">
		<BrowserRouter>
			<Switch>
				<Route path='/auth' exact component={Auth} />
				<PrivateRoute path="/create">
					<CreateNew />
				</PrivateRoute>
				<PrivateRoute path="/update/:id">
					<UpdateData />
				</PrivateRoute>
				<PrivateRoute path="/">
					<Home />
				</PrivateRoute>
			</Switch>
		</BrowserRouter>
	</div>
  );
}

export default App;
