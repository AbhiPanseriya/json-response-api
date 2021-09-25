import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import Editor, { useMonaco } from '@monaco-editor/react';
import * as  env from '../environment.json';

const LandingPage = () => {
    const history = useHistory();
    const monaco = useMonaco();

    const [data, setData] = useState({
        "what": "a simple JSON data store",
        "why": ["quick setup",
            "easy editing",
            "schema validation",
            "cors enabled (use anywhere)"
        ]
    });

    useEffect(() => {
        if (!monaco) return
        monaco.editor.defineTheme('mytheme', {
            base: 'vs',
            inherit: true,
            rules: [],
            colors: {
                "editor.background": "#f3f4f6"
            }
        });
    }, [monaco]);
    return (
        <div className="container m-auto">
            <div className="flex justify-between py-3">
                <div className="flex items-center cursor-pointer" onClick={() => history.push('/')}>
                    <img src="/logo.png" alt='' className="w-36 h-12 mr-2" />
                </div>
                <div className='flex space-x-4'>
                    <a className='btn shadow-none bg-white mr-2 py-1 px-2' target="blank" href={env.DOCUMENTATION_LINK}>
                        Docs
                    </a>
                    <div className='btn shadow-none bg-white mr-2 py-1 px-2 cursor-pointer' onClick={() => history.push('/auth')}>
                        Login
                    </div>
                </div>
            </div>
            <div className='p-10 bg-gray-100 rounded flex'>
                <div className='w-50'>
                    <div className='text-4xl max-w-xl p-4'>A Static JSON Endpoint which makes your life easier.</div>
                    <div className='text-lg max-w-md p-4'>Set up a lightweight JSON endpoint in seconds, and edit your data anytime. </div>
                </div>
                <div className='form-control w-0'>
                    <Editor
                        height='200px'
                        defaultLanguage='json'
                        defaultValue={JSON.stringify(data, null, '\t')}
                        onChange={(value, event) => {
                            if (JSON.parse(value) === data) return
                            setData(JSON.parse(value));
                        }}
                        theme='mytheme'
                    />
                </div>
            </div>
            <div className='flex justify-center'>
                <div className='btn shadow-none cursor-pointer mx-auto w-60 text-2xl text-center bg-blue-100' onClick={() => history.push('/auth')}>Get Started</div>
            </div>
        </div>
    )
}

export default LandingPage;
