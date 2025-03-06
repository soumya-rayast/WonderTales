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
import FilterInfoTitle from '../../components/FilterInfoTitle';
import { getEmptyCardMessage } from '../../utils/helper';

Modal.setAppElement("#root");

const Home = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState('');
  const [allStories, setAllStories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState('')
  const [dateRange, setDateRange] = useState({ form: null, to: null })


  // useState for open edit modal 
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: 'add',
    data: null
  });
  // useState for open view modal
  const [openViewModal, setOpenViewModal] = useState({
    isShown: false,
    data: null
  });
  // function to fetch user info
  const getUserInfo = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get("/api/users/get-user");
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
      const { data } = await axiosInstance.get("/api/stories/get-all-stories", { timeout: 30000 });
      if (data?.stories) {
        setAllStories(data.stories);
      }
    } catch (error) {
      console.error("An unexpected error occurred. Please try again.", error);
    }
  };
  // Function to update favourite status
  const updateIsFavourite = async (storyData) => {
    try {
      const response = await axiosInstance.put(`/api/stories/update-is-favourite/${storyData._id}`, {
        isFavourite: !storyData.isFavourite
      });

      if (response.data && response.data.story) {
        toast.success("Story updated successfully");
        if (filterType === 'search' && searchQuery) {
          onSearchStory(searchQuery);
        } else if (filterType === 'date') {
          filterTravelStoriesByDate(dateRange);
        } else {
          getAllTravelStories();
        }
      }
    } catch (error) {
      console.error("An unexpected error occurred. Please try again.", error);
    }
  };
  // function for close moa=dal
  const handleCloseModal = () => {
    setOpenAddEditModal({ isShown: false, type: "add", data: null });
    setOpenViewModal({ isShown: false, data: null });
  };
  // function for view story
  const handleViewStory = (data) => {
    setOpenAddEditModal({ isShown: false, type: "add", data: null });
    setOpenViewModal({ isShown: true, data })
  }
  const handleEditStory = (data) => {
    setOpenViewModal({ isShown: false, data: null });
    setOpenAddEditModal({ isShown: true, type: "edit", data: data })
  }
  // function for delete story
  const deleteTravelStory = async (data) => {
    const storyId = data._id;
    try {
      const response = await axiosInstance.delete("/api/stories/delete-story/" + storyId);
      if (response.data && !response.data.error) {
        toast.error("Story Deleted Successfully");
        setOpenViewModal((prevState) => ({ ...prevState, isShown: false }));
        getAllTravelStories();
      }
    } catch (error) {
      console.error("An unexpected error occurred. Please try again.", error);
    }
  }
  //function for search story 
  const onSearchStory = async (query) => {
    try {
      const response = await axiosInstance.get("/api/stories/search", {
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
  // function for clear search
  const handleClearSearch = () => {
    setFilterType('');
    getAllTravelStories();
  }
  //function for filter story
  const filterTravelStoriesByDate = async (day) => {
    try {
      const startDate = day.from ? moment(day.from).valueOf() : null;
      const endDate = day.to ? moment(day.to).valueOf() : null;

      if (startDate && endDate) {
        const response = await axiosInstance.get('/api/stories/filter', {
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
  // function for selecting range
  const handleDayClick = (day) => {
    setDateRange(day);
    filterTravelStoriesByDate(day);
  }
  //function for reset filter
  const resetFilter = () => {
    setDateRange({ from: null, to: null });
    setFilterType('');
    getAllTravelStories();
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
        onSearchNote={onSearchStory}
        handleClearSearch={handleClearSearch}
      />
      <div className='container mx-auto py-10'>
        <FilterInfoTitle
          filterType={filterType}
          filterDates={dateRange}
          onClear={() => {
            resetFilter()
          }}
        />
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
              <EmptyCard
                message={getEmptyCardMessage(filterType || "default")}
              />
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
        key={openAddEditModal.isShown ? "add-edit-modal" : "view-modal"}
        isOpen={openAddEditModal.isShown || openViewModal.isShown}
        onRequestClose={handleCloseModal}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 999,
          }
        }}
      >
        {openAddEditModal.isShown ? (
          <AddEditTravelStory
            type={openAddEditModal.type}
            storyInfo={openAddEditModal.data}
            getAllTravelStories={getAllTravelStories}
            onClose={handleCloseModal}
          />
        ) : (
          <ViewTravelStroy
            storyInfo={openViewModal.data}
            onClose={handleCloseModal}
            onEditClick={() => {
              handleEditStory(openViewModal.data);
            }}
            onDeleteClick={() => deleteTravelStory(openViewModal.data)}
          />
        )}
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
