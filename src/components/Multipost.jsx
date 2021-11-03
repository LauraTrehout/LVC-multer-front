import { useEffect, useState } from 'react';
import axios from 'axios'
import parse from 'html-react-parser'

import Tiny from './Tiny';

const Multipost = () => {

  const [imageOne, setImageOne] = useState();
  const [imageTwo, setImageTwo] = useState();
  const [imageThree, setImageThree] = useState();
  const [multipart, setMultipart] = useState({});
  const [getMultiple, setGetMultiple] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const res = await axios.get("http://localhost:4000/multiples");
      setGetMultiple(res.data);
    };
    getData();
  }, []);

  const submitMultipleData = async (event) => {
    event.preventDefault();
    const newPost = { ...multipart };
    if (imageOne && imageTwo && imageThree) {
      const fd = new FormData();
      const filename1 = Date.now() + imageOne.name;
      fd.append("image_1", imageOne, filename1);
      newPost.image_1 = filename1;
      const filename2 = Date.now() + imageTwo.name;
      fd.append("image_2", imageTwo, filename2);
      newPost.image_2 = filename2;
      const filename3 = Date.now() + imageThree.name;
      fd.append("image_3", imageThree, filename3);
      newPost.image_3 = filename3;
      try {
        await axios.post(`http://localhost:4000/upload`, fd);
      } catch (err) {
        console.log(err);
      }
    }
    try {
      const results = await axios.post(
        `http://localhost:4000/multiples`,
        newPost
      );
      setTimeout(() => {
        window.location.reload()
      }, 2000)
      console.log(results);
    } catch (err) {
      console.log(err);
    }
  };

  const setDataTiny = (text) => {
    setMultipart({ ...multipart, image_text: text })
  }
    
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h2>Multer multi image</h2>
      <form encType="multipart/form-data" style={{ display: "flex", flexDirection: "column", width: "50%" }}>
        <input
          type='file'
          name='image_1'
          onChange={(e) => {
            setImageOne(e.target.files[0]);
          }}
        />
        <input
          type='file'
          name='image_2'
          onChange={(e) => {
            setImageTwo(e.target.files[0]);
          }}
          
        />
        <input
          type='file'
          name='image_3'
          onChange={(e) => {
            setImageThree(e.target.files[0]);
          }}
        />
      </form>
      <Tiny setDataTiny={setDataTiny} />
      <button onClick={submitMultipleData}>Send</button>
      <div style={{ display: "flex", flexDirection: "column", width: "80%" }}>
      {getMultiple &&
          getMultiple.map((item) => (
            <>
            <p>{parse(`${item.image_text}`)}</p>
              <img
                src={`http://localhost:4000/static/images/${item.image_1}`}
                alt=""
              />
              <img
                src={`http://localhost:4000/static/images/${item.image_2}`}
                alt=""
              />
              <img
                src={`http://localhost:4000/static/images/${item.image_3}`}
                alt=""
              />
            </>
          ))}
      </div>
    </div>
  );
};

export default Multipost;
