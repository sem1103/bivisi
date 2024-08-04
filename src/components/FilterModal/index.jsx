import React, { useContext, useEffect, useState } from 'react';
import filter from "../../assets/icons/filter.svg";
import { IoCloseOutline } from "react-icons/io5";
import './style.scss';
import axios from 'axios';
import { BASE_URL } from '../../api/baseUrl';
const FilterModal = ({ applyFilter }) => {
    const [showModal, setShowModal] = useState(false);
    const [category, setCategory] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(0);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoryRes = await axios.get(`${BASE_URL}/categories/`);
                setCategory(categoryRes?.data.results);
            } catch (err) {
                console.log(err);
            }
        };

        fetchData();
    }, []);
    const handleSubmit = (e) => {
        e.preventDefault();
        applyFilter(selectedCategory, minPrice, maxPrice);
        setShowModal(false);
    }
    const handleCategoryChange = (e) => {
        const value = e.target.value;
        setSelectedCategory(value === "" ? "All" : value);
    };

    const handleClear = () => {
        setSelectedCategory("All");
        setMinPrice(0);
        setMaxPrice(0);
        applyFilter("All", 0, 0);
    };
    return (
        <>
            <button className="favorites_videos_filter stroke__change" onClick={() => setShowModal(true)}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Icon/Filter">
<path id="Vector" d="M2.5 4.16667H8.33333M8.33333 4.16667C8.33333 5.08714 9.07953 5.83333 10 5.83333C10.9205 5.83333 11.6667 5.08714 11.6667 4.16667M8.33333 4.16667C8.33333 3.24619 9.07953 2.5 10 2.5C10.9205 2.5 11.6667 3.24619 11.6667 4.16667M2.5 10H10M15.8333 10H17.5M15.8333 10C15.8333 10.9205 15.0871 11.6667 14.1667 11.6667C13.2462 11.6667 12.5 10.9205 12.5 10C12.5 9.07953 13.2462 8.33333 14.1667 8.33333C15.0871 8.33333 15.8333 9.07953 15.8333 10ZM11.6667 4.16667H17.5M10 15.8333H17.5M2.5 15.8333H4.16667M4.16667 15.8333C4.16667 16.7538 4.91286 17.5 5.83333 17.5C6.75381 17.5 7.5 16.7538 7.5 15.8333C7.5 14.9129 6.75381 14.1667 5.83333 14.1667C4.91286 14.1667 4.16667 14.9129 4.16667 15.8333Z" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
</g>
</svg>
                Filter
            </button>
            {showModal &&
                <><div className="modal-overlay" onClick={() => setShowModal(false)}></div>
                    <div className='filter-modal'>
                        <form onSubmit={handleSubmit}>
                            <div className='modal-head'>
                                <div className="modal-title">
                                    Filter
                                </div>
                                <button type='button' className="modal-close" onClick={() => setShowModal(false)}>
                                    <IoCloseOutline fontSize={30} />
                                </button>
                            </div>
                            <div className='category'>
                                <div className="sub-title">Category</div>
                                <select className='custom_dropdown' onChange={handleCategoryChange} value={selectedCategory}>
                                    <option value="">All</option>
                                    {category?.map(cat =>
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    )}
                                </select>

                            </div>
                            <div className='price'>
                                <div className="sub-title">Price</div>
                                <div className="d-flex">
                                    <input onChange={(e) => setMinPrice(e.target.value)} value={minPrice > 0 && minPrice} type="number" placeholder='Min price' />
                                    <input onChange={(e) => setMaxPrice(e.target.value)} value={maxPrice > 0 && maxPrice} type="number" placeholder='Max price' />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="clear-btn" onClick={handleClear}>Clear</button>
                                <button type='submit'>Apply Filter</button>
                            </div>
                        </form>
                    </div>
                </>
            }
        </>
    );
};

export default FilterModal;
