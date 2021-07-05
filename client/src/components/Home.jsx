import { useState } from 'react';
import Header from './Header';
import DataTable from "./DataTable";

const Home = () => {
    const [isCreateNewClicked, setIsCreateNewClicked] = useState(false);
    return (
        <div className="container m-auto">
            <Header isCreateNewClicked={isCreateNewClicked} setIsCreateNewClicked={setIsCreateNewClicked}/>
            <DataTable />
        </div>
    );
}

export default Home
