import { useEffect, useState } from "react";
import Editor, {useMonaco} from '@monaco-editor/react';
import { useHistory } from 'react-router-dom';

const DataForm = ({values, setValues, submitButtonText}) => {
    const [title, setTitle] = useState('');
    const [isTitleValid, setIsTitleValid] = useState(null);

    const [description, setDescription] = useState('');

    const [data, setData] = useState({});
    const [isDataValid, setIsDataValid] = useState(null);

    const monaco = useMonaco();

    const history = useHistory();
    
    useEffect(() => {
        if(!monaco) return
        monaco.editor.defineTheme('mytheme', {
            base: 'vs', 
            inherit: true,
            rules: [],
            colors: {
                "editor.background": "#f3f4f6"
            }
        });
    }, [monaco]);

    useEffect(() => {
        if(!values) return;
        setTitle(values.title || '');
        setDescription(values.description || '');
        setData(values.data || '');
    }, [values]);

    const onSubmitClicked = (e) => {
        e.preventDefault();
        if(!title || !isDataValid) return;
        const values = {
            title: title,
            description: description,
            data: data
        }
        setValues(values);
    }

    const onCancel = () => {
        history.push('/');
    }
    return (
       <div className='container mx-auto'>
            <form className='flex flex-col'>
                <label className='label'>
                    <span className="label-text">Title<span className="text-red-600">*</span>:</span>
                    <input 
                        className={`form-control ${(isTitleValid != null) && (isTitleValid ? ' border-green-500' : 'border-red-500')}`}
                        type="text"
                        value={title}
                        onChange={e => {
                            setTitle(e.target.value);
                            setIsTitleValid(e.target.value ? true : false);
                        }}
                    />
                </label>
                <label className='label'>
                    <span className="label-text">Description:</span>
                    <textarea 
                        className="resize-none form-control"
                        placeholder="enter the description"
                        rows="5"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        
                    ></textarea>
                </label>
                <label className='label'>
                    <span className="label-text">Data<span className="text-red-600">*</span>:</span>
                    <span className='form-control w-0'>
                        <Editor
                            height='50vh'                            
                            defaultLanguage='json'
                            defaultValue={JSON.stringify(data, null, '\t')}
                            onChange={(value, event) => {
                                if(JSON.parse(value) === data) return
                                setData(JSON.parse(value));
                            }}
                            theme='mytheme'
                            onValidate={(m) => { console.log(m); (m.length > 0) ? setIsDataValid(false) : setIsDataValid(true) }}
                        />
                    </span>
                </label>
                <div className="flex">
                    <div className="w-32 ml-2 hidden md:block">

                    </div>
                    <div className="flex flex-grow">
                        <button
                            className={`btn flex-grow mr-2 ${!isDataValid ? 'hover:bg-gray-100 hover:text-black hover:shadow-none' : ''}`}
                            type="submit"
                            onClick={(e) => onSubmitClicked(e)}
                            disabled={!isDataValid}
                        >
                            {submitButtonText}
                        </button>
                        <button
                            className="btn hover:bg-red-100 hover:text-red-500 flex-grow ml-2"
                            type="button"
                            onClick={(e) => onCancel(false)}
                        >
                            cancel
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default DataForm;
