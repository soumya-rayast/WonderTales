import React from 'react';
import moment from 'moment';
import { GrMapLocation } from "react-icons/gr";
import { FaHeart } from "react-icons/fa";

const TravelStoryCard = ({
  imgUrl,
  title,
  date,
  story,
  visitedLocation = [],
  isFavourite,
  onFavouriteClick,
  onClick
}) => {
  return (
    <div className='border rounded-lg overflow-hidden bg-white hover:shadow-lg hover:shadow-slate-200 transition-all ease-in-out relative cursor-pointer'>
      <img
        src={imgUrl}
        alt={title}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        className='w-full h-56 object-cover rounded-lg'
      />
      <button
        className='absolute top-4 right-4 flex w-12 h-12 items-center justify-center bg-white/40 rounded-lg border border-white/30'
        onClick={(e) => {
          e.stopPropagation();
          onFavouriteClick();
        }}
      >
        <FaHeart className={`icon-btn ${isFavourite ? "text-red-500 " : "text-white"}`} />
      </button>
      <div className='p-4' onClick={onClick}>
        <div className='flex items-center gap-3'>
          <div className='flex-1'>
            <h6 className='text-sm font-medium'>{title}</h6>
            <span>{date ? moment(date).format('Do MMM YYYY') : '-'}</span>
          </div>
        </div>
        <p className='text-xs text-slate-600 mt-2'>
          {story?.slice(0, 60)}...
        </p>
        <div className='inline-flex items-center gap-2 text-[13px] text-cyan-600 bg-cyan-200/40 rounded mt-3 px-2 py-1'>
          <GrMapLocation
            className='text-sm'
          />
          {
            visitedLocation.length > 0 ? visitedLocation.join(",") : "Unknown Location"
          }
        </div>
      </div>
    </div>
  );
};

export default TravelStoryCard;
