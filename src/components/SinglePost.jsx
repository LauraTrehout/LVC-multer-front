import { useState, useEffect, useCallback } from "react";
import axios from 'axios'

const SinglePost = () => {

  const [input, setInput] = useState({})
  const [image, setImage] = useState()
  const [getImages, setGetImages] = useState([])

  useEffect(() => {
    const getData = async () => {
      const res = await axios.get('http://localhost:4000/images')
        setGetImages(res.data)
    }
    getData()
  }, [])

  const onChangeHandler = useCallback (
    ({ target: { name, value } }) =>
      setInput(state => ({ ...state, [name]: value }), [])
  )


  const SubmitOneData = async (e) => {
    e.preventDefault()
    const newPost = {...input}
    if (image) {
      const fd = new FormData()
      const filename = Date.now() + image.name
      fd.append('single_image', image, filename)
      newPost.single_image = filename
      try {
        await axios.post(`http://localhost:4000/upload`, fd)
      } catch (err) {
        console.log(err)
      }
    }
    try {
      const res = await axios.post(
        `http://localhost:4000/images`,
        newPost
      )
      console.log('res post', res)
} catch (err) {
  console.log('logErrPost', err.response)
}
}

    return ( 
        <div style={{display: 'flex', flexDirection: 'column', width: '50%'}}>
        <h2>Multer</h2>
      <form encType='multipart/form-data' style={{display: 'flex', flexDirection: 'column', width: '50%'}}>
      <input 
          type='text'
          name='single_text'
          onChange={onChangeHandler}
        />
        <input 
          type='file'
          name='single_image'
          onChange={e => {
            setImage(e.target.files[0])
          }}
          />
      </form>
      <button onClick={SubmitOneData}>Send</button>
      <div style={{display: 'flex', flexDirection: 'column', width:'80%'}}>
      {getImages && 
          getImages.map(item =>  <img src={`http://localhost:4000/static/images/${item.single_image}`} alt={item.single_text}/>)}
   </div>
   </div>
     );
}
 
export default SinglePost;