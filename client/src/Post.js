
import {formatISO9075} from "date-fns";
import { Link } from "react-router-dom";

export default function Post({_id, author,title,summary,cover,content,option,time,distance,createdAt}){
    return(
        <div className = "post">
        <div className="image">
          <Link to={`/post/${_id}`}>
            <img src={'http://localhost:4000/'+cover} alt="something"></img>
          </Link>
        </div>
        <div className="texts">
          <Link to={`/post/${_id}`}>
            <h2>{title}</h2>
          </Link>
          <p className="info">
            <a className="author">{author.username}</a>
            <time>{formatISO9075(new Date(createdAt))}</time>
          </p>
          <div className="details">
            <p>Pool length: <i>{option}</i></p>
            <p>Practice duration: <i>{time}</i></p>
            <p>Distance: <i>{distance}</i></p>
          </div>
          <p className="summary1" >Summary: {summary}</p>
        </div>    
      </div>
    );
}