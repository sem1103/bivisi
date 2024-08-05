import React, { useContext, useEffect } from 'react';
import { IoCloseOutline } from "react-icons/io5";
import './style.scss';
import { ProductContext } from '../../context/ProductContext';

const FilterModal = ({ setShowModal }) => {
  const { selectedCategory, setSelectedCategory, category, maxPrice, setMaxPrice, minPrice, setMinPrice, applyFilter } = useContext(ProductContext);
  const handleSubmit = (e) => {
    e.preventDefault();
    applyFilter(selectedCategory, minPrice, maxPrice);
    setShowModal(false);
  };

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

  useEffect(() => {
    setSelectedCategory("All");
  }, []);

  return (
    <>
      <div className="modal-overlay" onClick={() => setShowModal(false)}></div>
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
              <input onChange={(e) => setMinPrice(e.target.value)} value={minPrice > 0 ? minPrice : ""} type="number" placeholder='Min price' />
              <input onChange={(e) => setMaxPrice(e.target.value)} value={maxPrice > 0 ? maxPrice : ""} type="number" placeholder='Max price' />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="clear-btn" onClick={handleClear}>Clear</button>
            <button type='submit'>Apply Filter</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default FilterModal;
