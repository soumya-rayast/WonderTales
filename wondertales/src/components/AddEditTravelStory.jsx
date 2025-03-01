import React, { useState } from 'react'
import { MdAdd, MdClose, MdDeleteOutline, MdUpdate } from 'react-icons/md'
import DateSelector from './DateSelector'
import ImageSelector from './ImageSelector';
import TagInput from './TagInput';
import axiosInstance from '../utils/axiosInstance';
import moment from 'moment';
import { toast } from 'react-toastify'
import uploadImage from '../utils/uploadImage';

const AddEditTravelStory = ({ storyInfo, type, onClose, getAllTravelStories }) => {

    const [visitedDate, setVisitedDate] = useState(storyInfo?.visitedDate || null);
    const [title, setTitle] = useState(storyInfo?.title || '');
    const [storyImg, setStoryImg] = useState(storyInfo?.imageUrl || null);
    const [story, setStory] = useState(storyInfo?.story || "");
    const [visitedLocation, setVisitedLocation] = useState(storyInfo?.visitedLocation || []);
    const [error, setError] = useState('')

    const extractErrorMessage = (error) => {
        return error.response?.data?.message || "An error occurred. Please try again.";
    };
    const addNewTravelStory = async () => {
        try {
            let imageUrl = storyImg ? (await uploadImage(storyImg)).imageUrl || "" : "";
            if (storyImg) {
                const imgUploads = await uploadImage(storyImg);
                imageUrl = imgUploads.imageUrl || "";
            }

            const response = await axiosInstance.post("/add-travel-story", {
                title,
                story,
                imageUrl: imageUrl || "",
                visitedLocation,
                visitedDate: visitedDate ? moment(visitedDate).valueOf() : moment().valueOf(),
            });

            if (response.data && response.data.story) {
                toast.success("story added successfully");
                getAllTravelStories();
                onClose();
            }
        } catch (error) {
            setError(extractErrorMessage(error));
        }
    }

    const updateTravelStory = async () => {
        const storyId = storyInfo._id;
        try {
            let imageUrl = storyInfo.imageUrl || "";
            let post = {
                title,
                story,
                imageUrl: storyInfo.imageUrl || "",
                visitedLocation,
                visitedDate: visitedDate ? moment(visitedDate).valueOf() : moment().valueOf(),
            }
            if (typeof storyImg === "object") {
                const imgUploadRes = await uploadImage(storyImg);
                imageUrl = imgUploadRes.imageUrl || "";

                post = {
                    ...post,
                    imageUrl: imageUrl
                }
            }

            const response = await axiosInstance.put("/edit-story/" + storyId, post);

            if (response.data && response.data.story) {
                toast.success("story edited successfully");
                getAllTravelStories();
                onClose();
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError("An unauthorized error occurred. Please try again. ")
            }
        }
    }

    const handleAddOrUpdateClick = () => {
        if (!title) {
            setError("please enter the title");
            return;
        }
        if (!story) {
            setError("Please enter the story")
            return;
        }
        setError("")

        if (type === "edit") {
            updateTravelStory();
        } else {
            addNewTravelStory();
        }
    };


    const handleDeleteStoryImg = async () => {
        const deleteImagesRes = await axiosInstance.delete('/delete-image', {
            params: {
                imageUrl: storyInfo.imageUrl,
            }
        });
        if (deleteImagesRes.data) {
            const storyId = storyInfo._id;
            const postData = {
                title,
                story,
                visitedLocation,
                visitedDate: moment().valueOf(),
                imageUrl: "",
            }
            await axiosInstance.put(
                "/edit-story/" + storyId,
                postData,
            )
            setStoryImg(null);
        }
    };


    return (
        <div className='relative'>
            <div className='flex items-center justify-between'>
                <h5 className='text-xl font-medium text-slate-700'>
                    {type === 'add' ? "Add Story" : " Update Story"}
                </h5>
                <div>
                    <div className=' flex items-center gap-3 bg-cyan-50/50 p-2 rounded-l-lg'>
                        {type === 'add' ?
                            <button
                                className='btn-small '
                                onClick={handleAddOrUpdateClick}>
                                <MdAdd className='text-lg' /> ADD STORY
                            </button> :
                            <>
                                <button
                                    className='btn-small'
                                    onClick={handleAddOrUpdateClick} >
                                    <MdUpdate className='text-lg' /> UPDATE STORY
                                </button>
                                <button
                                    className='btn-small btn-delete'
                                    onClick={onClose} >
                                    <MdDeleteOutline className='text-lg' />DELETE
                                </button>
                            </>
                        }
                        <button
                            className=''
                            onClick={onClose}>
                            <MdClose className="text-xl text-slate-400" />
                        </button>
                    </div>
                    {
                        error && (
                            <p className='text-red-500 text-xs pt-2 text-right'>{error}</p>
                        )
                    }
                </div>
            </div>
            <div>
                <div className='flex-1 flex flex-col gap-2 pt-4'>
                    <label
                        className='input-label'>TITLE</label>
                    <input
                        className={`text-xl text-slate-950 outline-none ${error && "border border-red-500"}`}
                        type="text"
                        placeholder='A Day at the Great Wall.'
                        value={title}
                        onChange={({ target }) => setTitle(target.value)}
                    />
                    <div className='my-3'>
                        <DateSelector
                            date={visitedDate}
                            setDate={setVisitedDate}
                            handleDeleteImg={handleDeleteStoryImg} />
                    </div>
                    <ImageSelector
                        image={storyImg}
                        setImage={setStoryImg} />
                    <div className='flex flex-col gap-2 mt-4'>
                        <textarea
                            type='text'
                            className='text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded'
                            placeholder='Your Story'
                            rows={10}
                            value={story}
                            onChange={({ target }) => setStory(target.value)}
                        />
                    </div>

                    <div className='pt-3'>
                        <label className='input-label'>VISITED LOCATIONS</label>
                        <TagInput
                            tags={visitedLocation}
                            setTags={setVisitedLocation} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddEditTravelStory