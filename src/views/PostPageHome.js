import { useEffect, useState } from "react";
import { Container, Image, Nav, Navbar, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";


export default function PostPageHome() {
  const [user] = useAuthState(auth);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

   async function getAllPosts() {
    const query = await getDocs(collection(db, "posts"));
    const posts = query.docs.map((doc) => {
        return { id: doc.id, ...doc.data()};
    })
    setPosts(posts);
  }

  useEffect(() => {
    getAllPosts();
  }, []);

  const ImagesRow = () => {
    return posts.map((post, index) => <ImageSquare key={index} post={post} />);
  };

  return (
    <>
      <Navbar variant="light" bg="light" >
        <Container>
          <Navbar.Brand href="/" style={{color:"#FF0088", fontSize:"3rem", fontFamily: "Brush Script MT, cursive"  }} >Tinkergram</Navbar.Brand>
          <Nav>
            {
          (user && <Nav.Link href="/add">New Post</Nav.Link>)
            ||  
            <Nav.Link onClick={()=>navigate("/login")}>LogIn / SignUp </Nav.Link> 
            }
            {
            
            (user && <Nav.Link onClick={() => signOut(auth)}>🚪</Nav.Link>) 
            
            }
          </Nav>
        </Container>
      </Navbar>
      <Container>
        <Row>
          <ImagesRow />
        </Row>
      </Container>
    </>
  );
}

function ImageSquare({ post }) {
  const { image, id } = post;
  return (
    <Link
      to={`post/${id}`}
      style={{
        width: "18rem",
        marginLeft: "1rem",
        marginTop: "2rem",
      }}
    >
      <Image
        src={image}
        className="block-example border border-primary rounded mb-0"
        style={{
          objectFit: "contain",
          width: "18rem",
          height: "18rem"
        }}
      />
    </Link>
  );
}