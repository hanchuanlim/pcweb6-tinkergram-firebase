import React, { useEffect, useState } from "react";
import { Button, Container, Form, Nav, Navbar, Image } from "react-bootstrap";
import { addDoc, collection } from "firebase/firestore";
import { useAuthState} from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db, storage} from "../firebase";
import { signOut } from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";


export default function PostPageAdd() {
  const [user, loading] = useAuthState(auth);
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");
  const [previewImage, setPreviewImage] = useState("https://zca.sg/img/placeholder");
  const [comment, setComment] = useState("");
  const navigate = useNavigate();


  async function addPost() {

    let timestamp = Date.now();

    const imageReference = ref(storage, `images/${timestamp+image.name}`);
    const response = await uploadBytes(imageReference, image);
    const imageUrl = await getDownloadURL(response.ref);

    await addDoc(collection(db, "posts"), {caption, image: imageUrl, imageName: timestamp+image.name, comment, liked: 0});
    navigate("/");

  }

  // we want to make sure only LOGGED IN users can add a post.
  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/login");
  }, [loading, user, navigate]);

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
        <h1 style={{ marginBlock: "1rem" }}>Add Post</h1>
        <Form>
          <Form.Group className="mb-3" controlId="caption">
            <Form.Label>Caption</Form.Label>
            <Form.Control
              type="text"
              placeholder="Lovely day"
              value={caption}
              onChange={(text) => setCaption(text.target.value)}
            />
          </Form.Group>
          <Image
            src={previewImage}
            style = {{
                objectFit: "contain",
                width: "10rem",
                height: "10rem"
            }}
            />


          <Form.Group className="mb-3" controlId="image">
            <Form.Label>Image</Form.Label>
            <Form.Control
              type="file"
              onChange={ (e) => {
                if (e.target.files.length === 0) return;
                const imageFile = e.target.files[0];
                const previewImage = URL.createObjectURL(imageFile);
                setImage (imageFile);
                setPreviewImage (previewImage);
              }
              }
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="comment">
            <Form.Label>Comment</Form.Label>
            <Form.Control
              as="textarea"
              rows = {3}
              placeholder="#Comments"
              value={comment}
              onChange={(text) => setComment(text.target.value)}
            />
          </Form.Group>


          <Button variant="primary" onClick={async (e) => addPost()}>
            Submit
          </Button>
        </Form>
      </Container>
    </>
  );
}