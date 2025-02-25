import React, { useEffect, useRef, useState } from 'react'
import { FaRegFile } from 'react-icons/fa'
import { MdDeleteOutline } from 'react-icons/md'
const ImageSelector = ({ image, setImage , handleDeleteImg}) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file)
    }
  }

  const onChooseFile = () => {
    inputRef.current.click();
  }

  const handleRemoveImage = () => {
    setImage(null);
    handleDeleteImg();
  }

  useEffect(() => {
    if (typeof image === "string") {
      setPreviewUrl(image);
    } else if (image) {
      setPreviewUrl(URL.createObjectURL(image));
    } else {
      setPreviewUrl(null);
    }
    return () => {
      if (previewUrl && typeof previewUrl === 'string' && !image) {
        URL.revokeObjectURL(previewUrl);
      }
    }
  }, [image]);

  return (
    <div>
      <input
        type="file"
        accept='image/'
        ref={inputRef}
        onChange={handleImageChange}
        className='hidden'
      />
      {image ? <button
        className='w-full flex flex-col items-center justify-center gap-4 bg-slate-50 rounded border border-slate-200/50'
        onClick={() => onChooseFile()}>
        <div
          className='flex w-14 h-14 items-center justify-center bg-cyan-50 rounded-full border-cyan-100'>
          <FaRegFile
            className='text-xl text-cyan-500' />
        </div>
        <p
          className='text-sm text-slate-500'>
          Browse image files to upload
        </p>
      </button> :
        <div className='w-full relative'>
          <img
            src={previewUrl}
            alt="Selected"
            className='w-full h-[300px] object-cover rounded-lg' />

          <button
            onClick={handleRemoveImage}
            className='btn-small btn-delete absolute top-2 right-2'>
            <MdDeleteOutline className='text-lg' />
          </button>
        </div>
      }
    </div>
  )
}

export default ImageSelector
