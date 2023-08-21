import React, { useEffect, useState } from "react";
import { Card, Col, Container, Image, Nav, Navbar, Row } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, storage } from "../firebase";
import { signOut } from "firebase/auth";
import { deleteDoc, doc, collection, getDoc, getDocs, addDoc, setDoc, updateDoc, query, where } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";

export default function PostPageDetails() {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");
  const [imageName, setImageName] = useState("");
  const [comment, setComment] = useState("");
  const [likeCount, setLikeCount] = useState(0);
  const params = useParams();
  const id = params.id;
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();


  async function likePost(id) {

    const postDocumentRef = doc(db, "posts", id);
    const postDocumentSnapshot = await getDoc(postDocumentRef);

    if (postDocumentSnapshot.exists()) {
      const likesCollectionRef = collection(postDocumentRef, "likes");
      const likesCollectionSnapshot = await getDocs(likesCollectionRef);

      if (likesCollectionSnapshot.empty) {
        // The "likes" sub-collection doesn't exist, create it
        await setDoc(doc(likesCollectionRef), {uid: user.uid, email: user.email, displayName: user.displayName});
        setLikeCount(1);

      } else {

        const q = query(likesCollectionRef, where("uid", "==", user.uid));
        const likesSnapshot = await getDocs(q);
        const element = document.getElementById("like-link");

        

        if (likesSnapshot.empty) {
          const likeDocRef = doc(likesCollectionRef); 
          await setDoc(likeDocRef, {uid: user.uid, email: user.email, displayName: user.displayName});
          // await setDoc(doc(likesCollectionRef), { like: [user.uid, user.email] });
          setLikeCount(likesCollectionSnapshot.size+1);

          // const element = document.getElementById("like-link");

          // Add styles to the element
          // element.style.color = "red";
          // element.style.fontSize = "16px";
          element.style.fontWeight = "bold";
        }
        else {
          const likeDocRef = doc(likesCollectionRef, likesSnapshot.docs[0].id); 

          try {
            await deleteDoc(likeDocRef);
            setLikeCount(likesCollectionSnapshot.size-1);
            element.style.fontWeight = "normal";

          } catch (error) {
            console.error(error.message);
          }

          

        }

      
      }
    }
    else {


    } 


    // const postDocument = await getDoc(doc(db, "posts", id));
    // const likescollection = postDocument.collection("likes");
    // await likescollection.add({like: user});
    // await updateDoc(doc(db, "posts", id), { likecount: likescollection.count()});

  }


  async function deletePost(id) {

    const deleteRef = ref(storage, `images/${imageName}`);
    deleteObject(deleteRef)
      .then(() => {
        console.log("image has been deleted from firebase storage");
      })
      .catch((error) => {
        console.error(error.message);
      })

    await deleteDoc(doc(db, "posts", id));
    navigate("/");
  }

  async function getPost(id) {
    const postDocumentRef = doc(db, "posts", id);
    const postDocument = await getDoc(postDocumentRef);
    const post = postDocument.data();

    setCaption(post.caption);
    setImage(post.image);
    setImageName(post.imageName);
    setComment(post.comment);


    const likesCollectionRef = collection(postDocumentRef, "likes");
    const likesCollectionSnapshot = await getDocs(likesCollectionRef);

    if (!likesCollectionSnapshot.empty) {
      setLikeCount(likesCollectionSnapshot.size);


      const q = query(likesCollectionRef, where("uid", "==", user.uid));
      const likesSnapshot = await getDocs(q);
      
      if (!likesSnapshot.empty) {
        const element = document.getElementById("like-link");
        element.style.fontWeight = "bold";

      }


    }


  }

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/login");
    getPost(id);
  }, [id, loading, user, navigate, likeCount]);


  return (
    <>
      <Navbar variant="light" bg="light">
        <Container>
          <Navbar.Brand href="/" style={{ color: "#FF0088", fontSize: "3rem", fontFamily: "Brush Script MT, cursive" }} >Tinkergram</Navbar.Brand>
          <Nav>
            <Nav.Link href="/add">New Post</Nav.Link>
            <Nav.Link onClick={() => signOut(auth)}>🚪</Nav.Link>
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

                <Card.Text className="m-2 p-3 rounded" style={{ backgroundColor: "#BDFDFE" }}>
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
                  id="like-link"
                >
                  Like 
                  {`(${likeCount})`}
                </Card.Link>

              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}