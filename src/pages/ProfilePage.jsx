import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Storage, API, graphqlOperation } from "aws-amplify";
import { listPosts } from "../graphql/queries";
import {
  createPost as createPostMutation,
  deletePost as deletePostMutation,
} from "../graphql/mutations";

import { v4 as uuid } from "uuid";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Container } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const ProfilePage = (props) => {
  const [profilePic, setProfilePic] = useState("");
  const [profilePicPaths, setProfilePicPaths] = useState([]);
  const [posts, setPosts] = useState([]);
  const [postData, setPostData] = useState({
    title: "",
    description: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    {
      // redirect to homepage if user isn't logged in
      !props.isAuthenticated && navigate("/");
    }
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const postsData = await API.graphql(graphqlOperation(listPosts));
      const postsList = postsData.data.listPosts.items;
      setPosts(postsList);
      // console.log(contactsList);

      // get contact images
      posts.map(async (post, index) => {
        const postProfilePicPath = posts[index].image;
        try {
          const postProfilePicPathURI = await Storage.get(postProfilePicPath, {
            expires: 60,
          });
          setProfilePicPaths([...profilePicPaths, postProfilePicPathURI]);
        } catch (error) {
          console.log(error);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const addNewPost = async () => {
    try {
      const { title, description } = postData;

      // Upload pic to S3
      Storage.configure({ region: "eu-north-1" });
      const { key } = await Storage.put(`${uuid()}.png`, profilePic, {
        contentType: "image/png",
      });

      const newPost = {
        id: uuid(),
        title,
        description,
        image: key,
      };
      // persists new contact
      await API.graphql(
        graphqlOperation(createPostMutation, { input: newPost })
      );
      fetchPosts();
    } catch (error) {
      console.log(error);
    }
  };

  async function deletePost({ id, name }) {
    const newPosts = posts.filter((post) => post.id !== id);
    setPosts(newPosts);
    await Storage.remove(name);
    await API.graphql({
      query: deletePostMutation,
      variables: { input: { id } },
    });
  }

  console.log(posts);

  return (
    <Container className="px-4 my-5">
      <Row>
        <Col>
          <h1>Images</h1>
        </Col>
      </Row>
      <Row>
        {posts.map((post, index) => {
          return (
            <Col key={index} className="my-2 px-2">
              <Card style={{ width: "12rem" }}>
                <Card.Img variant="top" src={profilePicPaths[index]} />
                <Card.Body>
                  <Card.Title>{post.name}</Card.Title>
                  <Card.Text>{post.description}</Card.Text>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => deletePost(post.id)}
                  >
                    Delete post
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
      <Row className="px-4 my-5">
        <Col sm={3}>
          <h2>Add New Post</h2>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicText">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="title"
                value={postData.title}
                onChange={(evt) =>
                  setPostData({ ...postData, title: evt.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicText">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="description"
                value={postData.description}
                onChange={(evt) =>
                  setPostData({ ...postData, description: evt.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicText">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/png"
                onChange={(evt) => setProfilePic(evt.target.files[0])}
              />
            </Form.Group>
            <Button variant="primary" type="button" onClick={addNewPost}>
              Add Contact &gt;&gt;
            </Button>
            &nbsp;
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;
