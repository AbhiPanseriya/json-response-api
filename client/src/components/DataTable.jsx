import { useEffect, useState } from 'react';
import {http} from '../utils/axios';
import ApiPreview from './ApiPreview';
import InfiniteScroll from 'react-infinite-scroll-component';
import Swal from 'sweetalert2';

const DataTable = () => {
    const pageSize = 10;
    const [apis, setApis] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const loader = <div className='flex items-center justify-center w-full h-96'>Loading...</div>;

    const fetchData = async (p) => {
        try {
            const response = await http.get(`/get-apis-list?page=${p ?? page}`);
            response.data.length < pageSize ? setHasMore(false) : setHasMore(true);
            (p ?? page) === 0 ? setApis([...response.data]) : setApis([...apis, ...response.data]);
            setPage((p ?? page) + 1)
        } catch(err) {
        }
    }
    useEffect(() => {
        setPage(0);
        fetchData(0);
    }, []);

    const onApiDelete = async (id) => {
        const swalResult = await Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this api!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it',
            customClass: {
                confirmButton: 'btn bg-blue-50 mr-8',
                cancelButton: 'btn hover:bg-red-100 hover:text-red-500 bg-red-50 mr-2'
            }
        })
        if (swalResult.isConfirmed) {
            try {
                const response = await http.delete(`/delete-api`, {
                    headers: {
                        id: id
                    }
                });
                setApis(apis.filter(a => a._id !== response.data._id));
    
            } catch(err) {
                Swal.fire("Uh, Oh something went wrong", "please try again later", 'error');
            }
            Swal.fire(
                'Deleted!',
                'Your api is Deleted.',
                'success'
            )
        }
    }

    return (
        <div className='mt-4 rounded-md flex flex-col overflow-auto'>
            <InfiniteScroll
                dataLength={apis.length || 0}
                next={fetchData}
                hasMore={hasMore}
                loader={loader}
                endMessage={<div className='py-10 text-center text-xl text-gray-500'>Seems like you've came to an end</div>}
            >
                {apis.map(api => <ApiPreview key={api._id} apiData={api} onApiDelete={onApiDelete}/>)}
            </InfiniteScroll>
        </div>
    )
}

export default DataTable
