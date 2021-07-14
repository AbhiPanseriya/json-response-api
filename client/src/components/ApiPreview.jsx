import Editor from '@monaco-editor/react';
import Moment from 'moment';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faChevronDown, faChevronUp, faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useHistory } from 'react-router';
import * as env from '../environment.json';

const ClientSecretStatus = {
    NOT_REVEALED: 0,
    REVEALED_BUT_NOT_COPIED: 1,
    COPY_TO_CLIPBOARD: 2,
    COPIED: 3
}

const ApiPreview = ({ apiData, onApiDelete }) => {
    const history = useHistory();
    const [clientSecretStatus, setClientSecretStatus] = useState(ClientSecretStatus.NOT_REVEALED);
    const [editorHeight, setEditorHeight] = useState(0);

    const onClientCodeClicked = () => {
        if (clientSecretStatus === ClientSecretStatus.NOT_REVEALED) {
            setClientSecretStatus(ClientSecretStatus.REVEALED_BUT_NOT_COPIED);
            return;
        } else if (clientSecretStatus === ClientSecretStatus.COPY_TO_CLIPBOARD){
            setClientSecretStatus(ClientSecretStatus.COPIED);
            copyTextToCliboard(`${env.REACT_APP_SERVER}/v1/get/${apiData.clientSecret}`);
            setTimeout(() => {
                setClientSecretStatus(ClientSecretStatus.REVEALED_BUT_NOT_COPIED);
            }, [5000]);
        }
    }

    const onClientCodeHover = () => {
        if(clientSecretStatus === ClientSecretStatus.REVEALED_BUT_NOT_COPIED) {
            setClientSecretStatus(ClientSecretStatus.COPY_TO_CLIPBOARD)
        }
    }

    const onClientCodeHoverOut = () => {
        if(clientSecretStatus === ClientSecretStatus.COPY_TO_CLIPBOARD) {
            setClientSecretStatus(ClientSecretStatus.REVEALED_BUT_NOT_COPIED)
        }
    }

    const copyTextToCliboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            
        });
    }

    const onApiUpdate = () => {
        history.push(`/update/${apiData._id}`);
    }

   

    return (apiData != null) && (
        <div className='bg-gray-100 rounded p-3 my-4'>
            <div className='flex'>
                <div className='flex flex-col flex-grow'>
                    <div className='text-2xl'>{apiData.title}</div>
                    <div>{apiData.description}</div>
                    
                </div>
                <div className='flex flex-col justify-between'>
                    <div>created {Moment(apiData.createdAt).fromNow()}</div>
                </div>
            </div>
            <div className='flex justify-between items-center'>
                <div 
                    className={`px-2 py-1 cursor-pointer rounded w-2/5 text-center text-sm transition-all
                        ${clientSecretStatus === ClientSecretStatus.NOT_REVEALED 
                            && 'bg-gray-400 text-gray-400 hover:bg-gray-300 hover:text-black'} 
                        ${(clientSecretStatus === ClientSecretStatus.REVEALED_BUT_NOT_COPIED || clientSecretStatus === ClientSecretStatus.COPY_TO_CLIPBOARD)
                            && 'bg-gray-200 text-black hover:bg-gray-300'}
                        ${clientSecretStatus === ClientSecretStatus.COPIED
                            && 'bg-gray-200 text-green-500'}
                        `}
                    onClick={onClientCodeClicked}
                    onMouseOver={onClientCodeHover}
                    onMouseLeave={onClientCodeHoverOut}
                >
                    {clientSecretStatus === ClientSecretStatus.NOT_REVEALED ? 'click here to reveal the api endpoint' : ''}
                    {clientSecretStatus === ClientSecretStatus.REVEALED_BUT_NOT_COPIED ? `${env.REACT_APP_SERVER}/v1/get/${apiData.clientSecret}` : ''}
                    {clientSecretStatus === ClientSecretStatus.COPY_TO_CLIPBOARD ? 'copy to clipboard' : ''}
                    {clientSecretStatus === ClientSecretStatus.COPIED && ( 
                        <span className='flex items-center text-center justify-center'>
                            copied to clipboard
                            <FontAwesomeIcon icon={faCheck} className='ml-1' />
                        </span> 
                    )}
                </div>
                <div className='flex justify-end items-center space-x-4'>
                    <div className='flex space-x-4 ml-4'>
                        <FontAwesomeIcon icon={faPencilAlt} className='btn p-0' onClick={onApiUpdate} />
                        <FontAwesomeIcon icon={faTrash} className='btn p-0' onClick={() => onApiDelete(apiData._id)} />
                        {/* <FontAwesomeIcon icon={faEye} className='btn p-0' /> */}
                    </div>
                    <div className=''>
                        {(editorHeight === 0)
                            ? <button className='btn py-1 text-xs space-x-4' onClick={() => setEditorHeight(60)}>
                                <span>show JSON</span>
                                <FontAwesomeIcon icon={faChevronDown} />
                            </button>
                            : <button className='btn py-1 text-xs space-x-4' onClick={() => setEditorHeight(0)}>
                                <span>hide JSON</span>
                                <FontAwesomeIcon icon={faChevronUp} />
                            </button>
                        }
                    </div>
                </div>
            </div>
            { editorHeight !== 0 && <div>
                JSON Data:
                <Editor
                    height={`${editorHeight}vh`}
                    defaultLanguage='json'
                    defaultValue={JSON.stringify(apiData.data, null, '\t')}
                    options={{
                        readOnly: true
                    }}
                    theme='vs-light'
                    className='border rounded'
                    />
                </div>
            }
        </div>
    )
}

export default ApiPreview
