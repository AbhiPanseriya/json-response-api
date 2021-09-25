import { Route, Redirect } from 'react-router-dom';
import { isAutheticated } from '../auth/Auth';

const PrivateRoute = ({ children, ...rest }) => {
    return (
        <Route 
            {...rest} 
            render = { ({ location }) =>
                isAutheticated() ? (
                    children
                ) : (
                        <Redirect to={{ pathname: "/home", state: { from: location } }} />
                )
            }
        />
    )
}

export default PrivateRoute
