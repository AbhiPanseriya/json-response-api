import DataForm from './DataForm';
import Header from './Header';
import { useEffect, useState } from 'react';
import { http } from '../utils/axios';
import { useHistory, useParams } from 'react-router-dom';

const UpdateData = () => {
    const history = useHistory();

    const { id } = useParams();
    const [values, setValues] = useState({});

    useEffect(() => {
        if (!id) return
        http.get(`/get-api`, {
            headers: {
                id: id
            }
        }).then(res => {
            setValues({
                title: res.data.title,
                description: res.data.description,
                data: res.data.data
            });
        }).catch(err => {
            history.push('/');
        });

    }, [id, history]);

    const onUpdateApi = async ({ title, description, data }) => {
        await http.patch('/update-api', {
            title, description, data, id
        });
        history.push('/');
    }

    return (
        <div className='container mx-auto'>
            <Header />
            {Object.keys(values).length !== 0 &&
                <DataForm values={values} setValues={onUpdateApi} submitButtonText='update' />
            }
        </div>
    )
}

export default UpdateData