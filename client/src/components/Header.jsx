import { googleLogout, isAutheticated } from "../auth/Auth";
import { useHistory } from "react-router";

const Header = ({ isCreateNewClicked, setIsCreateNewClicked }) => {
    const user = isAutheticated();
    const history = useHistory();

    return (
        <div className="flex justify-between py-3">
            <div className="flex items-center cursor-pointer" onClick={() => history.push('/')}>
                <img src="/logo.png" alt='' className="w-36 h-12 mr-2" />
            </div>
            <div className="flex items-center">
                {
                    !isCreateNewClicked && (
                        <button
                            className="btn shadow-none bg-white mr-2 py-1 px-2"
                            onClick={(e) => {
                                setIsCreateNewClicked(true);
                                history.push('/create')
                            }}
                        >
                            {/* <span>create</span> */}
                            <img className="h-8 py-1" src="/assets/plus.svg" alt='' />
                        </button>
                    )
                }
                <span className="hidden sm:block mr-2">{user.name}</span>
                <img className="rounded-full h-8" src={user.imageUrl} loading="lazy" alt='' />
                {googleLogout(history)}
            </div>
        </div>
    )
}

export default Header
