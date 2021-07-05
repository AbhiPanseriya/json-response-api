
import DataForm from './DataForm';
import Header from './Header';
import {http} from '../utils/axios';
import { useHistory } from 'react-router-dom';

const CreateNew = () => {
    const history = useHistory();

    const onCreateApi = async ({title, description, data}) => {
        await http.post('/create-api', {
            title: title, description: description, data: data
        });
        history.push('/');
    }
    
    return (
        <div className='container mx-auto'>
            <Header isCreateNewClicked={true} />
            <DataForm submitButtonText='create' setValues={onCreateApi} />
        </div>
    )
}

export default CreateNew
