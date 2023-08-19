import React, { useEffect, useReducer, useState } from "react";
import { Card, Col, Container, Image, Nav, Navbar, Row } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, storage} from "../firebase";
import { signOut} from "firebase/auth";
import {deleteDoc, doc, getDoc, updateDoc} from "firebase/firestore";
import { ref, deleteObject} from "firebase/storage";

export default function PostPageDetails() {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");
  const [imageName, setImageName] = useState("");
  const [comment, setComment] = useState("");
  const params = useParams();
  const id = params.id;
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();


  async function likePost(id) {
    const postDocument = await getDoc(doc(db, "posts", id));
    const likescollection = postDocument.collection("likes")
    likescollection.add({like: user});


    // await updateDoc(doc(db, "posts", id), { likecount: likescollection.count()});

  }


  async function deletePost(id) {

    const deleteRef = ref(storage, `images/${imageName}`);
    deleteObject(deleteRef)
    .then(()=> {
        console.log("image has been deleted from firebase storage");
    })
    .catch((error)=> {
        console.error(error.message);
    })

    await deleteDoc(doc(db, "posts", id));
    navigate("/");
  }

  async function getPost(id) {
    const postDocument = await getDoc(doc(db, "posts", id));
    const post = postDocument.data();

    setCaption(post.caption);
    setImage(post.image);
    setImageName(post.imageName);
    setComment(post.comment);
  }

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/login");
    getPost(id);
  }, [id, loading, user, navigate]);


  return (
    <>
      <Navbar variant="light" bg="light">
        <Container>
          <Navbar.Brand href="/"  style={{color:"#FF0088", fontSize:"3rem", fontFamily: "Brush Script MT, cursive"  }} >Tinkergram</Navbar.Brand>
          <Nav>
            <Nav.Link href="/add">New Post</Nav.Link>
            <Nav.Link onClick={()=> signOut(auth)}>🚪</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Container>
        <Row style={{ marginTop: "2rem" }}>
          <Col md="6">
            <Image src={image} style={{ width: "100%" }} />
          </Col>
          <Col>
            <Card>
              <Card.Body>
                <Card.Title>{caption}</Card.Title>

                <Card.Text className="m-2 p-3 rounded" style={{backgroundColor: "#BDFDFE"}}>
                  {comment}
                </Card.Text>
                
                <Card.Link href={`/update/${id}`}>Edit</Card.Link>
                <Card.Link
                  onClick={() => deletePost(id)}
                  style={{ cursor: "pointer" }}
                >
                  Delete
                </Card.Link>

                <Card.Link
                  onClick={() => likePost(id)}
                  style={{ cursor: "pointer" }}
                >
                  Like
                </Card.Link>

              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}