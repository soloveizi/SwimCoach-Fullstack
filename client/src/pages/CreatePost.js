import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css'
import {useState} from "react";
import { Navigate } from "react-router-dom";



export default function CreatePost(){
    const [title , setTitle] = useState('');
    const [summary , setSummary] = useState('');
    const [content , setContent] = useState('');
    const [files , setFiles] = useState('');
    const [distance, setDistance] = useState('');
    const [option, setOption] = useState('1');
    const [time, setTime] = useState('1');
    const [redirect, setRedirect] = useState(false);


    async function createNewPost(ev){
        const data = new FormData();
        data.set('title' , title);
        data.set('summary' , summary);
        data.set('content' , content);
        data.set('file' , files[0]);
        data.set('option', option);
        data.set('time', time);
        data.set('distance', distance);
        ev.preventDefault();
        const response = await fetch('http://localhost:4000/post' , {
            method: 'POST',
            body: data,
            credentials: 'include',
        })
        if (response.ok){
            setRedirect(true);
            alert('post creation seccessful');
        }else{
            alert('post creation failed');
        }
    }
    if (redirect) {
        return <Navigate to={'/'} />
    }
    return (
        <form onSubmit={createNewPost}>
            <input type="title" placeholder={'title'} value={title} onChange={ev => setTitle(ev.target.value)}></input>
            <input type="summary" placeholder={'summary'} value={summary} onChange={ev => setSummary(ev.target.value)} maxLength={50}></input>
            <input type="file" onChange={ev => setFiles(ev.target.files)} accept="image/*"/>
            <select value={option} onChange={ev => setOption(ev.target.value)}>
                <option value="Short course Meters">Short course Meters (25m) </option>
                <option value="Long course Meters">Long course Meters (50m)</option>
                <option value="Short course yards">Short course yards (25y)</option>
            </select>
            <select value={time} onChange={ev => setTime(ev.target.value)}>
                <option value="30 Minutes">30 Minutes</option>
                <option value="1 Hour">1 Hour</option>
                <option value="1.5 Hours">1.5 Hours</option>
                <option value="2 Hours">2 Hours</option>
                <option value="2+ Hours">2+ Hours</option>
            </select>
            <input type="number" placeholder={'Distance'} value={distance} onChange={ev => setDistance(ev.target.value)}></input>
            <ReactQuill value = {content} onChange={newValue => setContent(newValue)}></ReactQuill>
            <button style={{marginTop:'5px'}}>Create Post</button>
        </form>
    );

}