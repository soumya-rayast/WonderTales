import React, { useEffect, useState, useCallback } from 'react';
import Navbar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import TravelStoryCard from '../../components/TravelStoryCard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MdAdd } from "react-icons/md";
import Modal from 'react-modal';
import AddEditTravelStory from '../../components/AddEditTravelStory';
import ViewTravelStroy from '../../components/ViewTravelStroy';
import EmptyCard from '../../components/EmptyCard';
import { DayPicker } from 'react-day-picker';
import moment from 'moment';

Modal.setAppElement("#root");

const Home = () => {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(null);
  const [allStories, setAllStories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState('')
  const [dateRange, setDateRange] = useState({ form: null, to: null })

  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: 'add',
    data: null
  });

  const [openViewModal, setOpenViewModal] = useState({
    isShown: false,
    type: 'add',
    data: null
  });
  // Function to fetch user info
  const getUserInfo = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get("get-user");
      if (data?.user) {
        setUserInfo(data.user);
      }
    } catch (error) {
      if (error.response?.status === 400) {
        localStorage.clear();
        navigate('/login');
      }
    }
  }, [navigate]);

  // Function to fetch all travel stories
  const getAllTravelStories = async () => {
    try {
      const { data } = await axiosInstance.get("/get-all-stories");
      if (data?.stories) {
        setAllStories(data.stories);
      }
    } catch (error) {
      console.error("An unexpected error occurred. Please try again.");
    }
  };

  // Function to update favourite status
  const updateIsFavourite = async (storyData) => {
    try {
      const { data } = await axiosInstance.put(`/update-is-favourite/${storyData._id}`, {
        isFavourite: !storyData.isFavourite
      });

      if (data?.story) {
        toast.success("Story updated successfully");
        getAllTravelStories();
      }
    } catch (error) {
      console.error("An unexpected error occurred. Please try again.");
    }
  };

  const handleCloseModal = () => {
    setOpenAddEditModal({ isShown: false, type: "add", data: null });
  };

  const handleViewStory = (data) => {
    setOpenViewModal({ isShown: true, data })
  }
  const handleDelete = (data) => {
    setOpenAddEditModal({ isShown: true, type: "edit", data: data })
  }

  const deleteTravelStory = async (data) => {
    const storyId = data._id;

    try {
      const response = await axiosInstance.delete("/delete-story" + storyId);
      if (response.data && !response.data.error) {
        toast.error("Story Deleted Successfully");
        setOpenViewModal((prevState) => ({ ...prevState, isShown: false }));
        getAllTravelStories();
      }
    } catch (error) {
      console.error("An unexpected error occurred. Please try again.", error);
    }
  }


  const onSearchStory = async (query) => {
    try {
      const response = await axiosInstance.get("/search", {
        params: {
          query,
        }
      });

      if (response.data && response.data.stories) {
        setFilterType('search');
        setAllStories(response.data.stories);
      }
    } catch (error) {
      console.error("An unexpected error occurred. Please try again.", error);
    }
  }

  const handleClearSearch = () => {
    setFilterType('');
    getAllTravelStories();
  }

  const filterTravelStoriesByDate = async (day) => {
    try {
      const startDate = day.from ? moment(day.from).valueOf() : null;
      const endDate = day.to ? moment(day.to).valueOf() : null;

      if (startDate && endDate) {
        const response = await axiosInstance.get('/travel-stories/filter', {
          params: { startDate, endDate },
        })
        if (response.data && response.data.stories) {
          setFilterType('date');
          setAllStories(response.data.stories)
        }
      }
    } catch (error) {
      console.error("An unexpected error occurred. Please try again.", error);
    }
  }
  const handleDayClick = (day) => {
    setDateRange(day);
    filterTravelStoriesByDate(day);
  }
  useEffect(() => {
    getUserInfo();
    getAllTravelStories();
  }, [getUserInfo, getAllTravelStories]);

  return (
    <div>
      <Navbar
        userInfo={userInfo}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={onSearchStory}
        handleClearSearch={handleClearSearch}
      />
      <div className='container mx-auto py-10'>

        
        <div className='flex gap-7'>
          <div className='flex-1'>
            {allStories.length > 0 ? (
              <div className='grid grid-cols-2 gap-4'>
                {allStories.map((item) => (
                  <TravelStoryCard
                    key={item._id}
                    imgUrl={item.imageUrl}
                    title={item.title}
                    story={item.story}
                    date={item.visitedDate}
                    visitedLocation={item.visitedLocation}
                    onEdit={() => setOpenAddEditModal({ isShown: true, type: "edit", data: item })}
                    onClick={() => handleViewStory(item)}
                    onFavouriteClick={() => updateIsFavourite(item)}
                  />
                ))}
              </div>
            ) : (
              <EmptyCard message={`Start creating your story. Click Add icon to add `} />
            )}
          </div>
          <div className='w-[320px]'>
            <div className='bg-white border border-slate-200 shadow-lg shadow-slate-200/60 rounded-lg'>
              <div className='p-3'>
                <DayPicker
                  captionLayout='dropdown-buttons'
                  mode='range'
                  selected={dateRange}
                  onSelect={handleDayClick}
                  pagedNavigation
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Story Modal */}
      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={handleCloseModal}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 999
          }
        }}
        className='model-box'
      >
        <AddEditTravelStory
          type={openAddEditModal.type}
          storyInfo={openAddEditModal.data}
          getAllTravelStories={getAllTravelStories}
          onClose={handleCloseModal}
        />
      </Modal>

      <Modal
        isOpen={openViewModal.isShown}
        onRequestClose={() => { }}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 999,
          }
        }}
        appElement={document.getElementById("root")}
        className="model-box"
      >
        <ViewTravelStroy
          storyInfo={openViewModal.data || null}
          onClose={() => setOpenViewModal((prevState) => ({ ...prevState, isShown: false }))}
          onEditClick={() => {
            setOpenViewModal((prevState) => ({ ...prevState, isShown: false })),
              handleDelete(openViewModal.data || null)
          }}
          onDeleteClick={() => {
            deleteTravelStory(openViewModal.data || null)
          }}
        />
      </Modal>

      {/* Add Story Button */}
      <button
        className='w-16 h-16 flex items-center justify-center rounded-full bg-primary hover:bg-cyan-400 fixed right-10 bottom-10 shadow-lg'
        onClick={() => setOpenAddEditModal({ isShown: true, type: "add", data: null })}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      <ToastContainer />
    </div>
  );
};

export default Home;
