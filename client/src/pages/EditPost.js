import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import { Navigate, useParams } from "react-router-dom";

export default function EditPost() {
    const {id} = useParams();
    const [title , setTitle] = useState('');
    const [summary , setSummary] = useState('');
    const [content , setContent] = useState('');
    const [files , setFiles] = useState('');
    const [distance, setDistance] = useState('');
    const [option, setOption] = useState('1');
    const [time, setTime] = useState('1');
    const [redirect, setRedirect] = useState(false);


    useEffect(() => {
        fetch(`http://localhost:4000/post/${id}`).then(response => {
            response.json().then(postInfo => {
                setTitle(postInfo.title);
                setSummary(postInfo.summary);
                setContent(postInfo.content);
                setFiles(postInfo.cover);
                setDistance(postInfo.distance);
                setOption(postInfo.option);
                setTime(postInfo.time);
            });
        })
    } , [])

    async function updatePost(ev){
        ev.preventDefault();
        const data = new FormData();
        data.set('title' , title);
        data.set('summary' , summary);
        data.set('content' , content);
        data.set('option', option);
        data.set('time', time);
        data.set('distance', distance);
        data.set('id' , id);
        if (files?.[0]){
            data.set('file' , files?.[0]);
        }
        const response = await fetch(`http://localhost:4000/post`, {
            method: 'PUT',
            body: data,
            credentials: 'include',
    
    });
    if (response.ok){
        setRedirect(true);
    }
}

    if (redirect) {
        return <Navigate to={'/post/'+id} />
    }
    return (
        <form onSubmit={updatePost}>
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
            <button style={{marginTop:'5px'}}>Update Post</button>
        </form>
    );
}