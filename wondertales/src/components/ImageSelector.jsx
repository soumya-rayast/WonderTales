import React, { useRef, useState } from 'react'
import { FaRegFile } from 'react-icons/fa'
const ImageSelector = ({ image, setImage }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = () => {

  }

  const onChooseFile = () =>{
    inputRef.current.click();
  }

  return (
    <div>
      <input
        type="file"
        accept='image/'
        ref={inputRef}
        onChange={handleImageChange}
        className='hidden'
      />
      <button className='w-full flex flex-col items-center justify-center gap-4 bg-slate-50 rounded border border-slate-200/50' onClick={() => onChooseFile()}>
        <div className='flex w-14 h-14 items-center justify-center bg-cyan-50 rounded-full border-cyan-100'>
          <FaRegFile className='text-xl text-cyan-500' />
        </div>
        <p className='text-sm text-slate-500'>Browse image files to upload</p>
      </button>
    </div>
  )
}

export default ImageSelector
