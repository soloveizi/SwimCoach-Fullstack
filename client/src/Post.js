import { formatISO9075 } from "date-fns";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "./UserContext";

export default function Post({_id, author, title, summary, cover, content, option, time, distance, createdAt}) {
  const { userInfo } = useContext(UserContext);
  const navigate = useNavigate();
  const { id } = useParams();

  const handleDelete = () => {
    fetch(`http://localhost:4000/post/${_id}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        alert(data.message);
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Failed to delete the post. " + error);
      });
  };

  return (
    <div className="post">
      <div className="image">
        <Link to={`/post/${_id}`}>
          <img src={'http://localhost:4000/' + cover} alt="Cover image" />
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
        <p className="summary1">Summary: {summary}</p>
        {userInfo && userInfo.id === author._id && (
        <div className="post-edit-delete">
          <Link className="edit-btn-post" to={`/edit/${_id}`}>
            <button>Edit</button>
          </Link>
          <button className="delete-btn-post" onClick={handleDelete}>Delete</button>
        </div>
      )}
      </div>
    </div>
  );
}
