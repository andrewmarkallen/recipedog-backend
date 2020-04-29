import React, { useState, useMemo, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import axios from 'axios'
import { upload_url } from './Util.jsx'
import { baseStyle,   activeStyle,
         acceptStyle, rejectStyle,
         thumb,       thumbInner,
         img,         thumbsContainer } from './ImageDropzoneStyles.jsx'

const ImageDropzone = (props)  => {
  const [files, setFiles] = useState([])

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({
    accept: 'image/*',
    onDrop: acceptedFiles  => {
      setFiles(acceptedFiles.map(file  => Object.assign(file, {
        preview: URL.createObjectURL(file)
      })))
      acceptedFiles.map(file  => {
        var formData = new FormData()
        formData.append('file', file)
        const promise = axios.post(upload_url, formData)
          .then((res)  => { props.setFilename(res.data.filename) })
          .catch((err)  => { console.log(err) })
        props.handleImageUpload(promise)
        return promise
      })
    }
  })

  const thumbs = files.map(file => (
      <div style={thumb} key={file.name}>
        <div style={thumbInner}>
          <img
            alt='prepared_recipe'
            src={file.preview}
            style={img}
          />
        </div>
      </div>
    ))

  useEffect(()  => ()  => {
    files.forEach(file  => URL.revokeObjectURL(file.preview))
  }, [files])

  const style = useMemo(()  => ({
    ...baseStyle,
    ...(isDragActive ? activeStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {})
  }), [
    isDragActive,
    isDragAccept,
    isDragReject
  ])


  return (
      <div className="container">
        <div {...getRootProps({style})}>
          <input {...getInputProps()} />
          <p>Drag and drop or click to add an image</p>
        </div>
        <aside style={thumbsContainer}>
          {thumbs}
        </aside>
      </div>
  )
}

export default ImageDropzone
