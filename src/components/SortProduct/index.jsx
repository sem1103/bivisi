import React, { useEffect, useState } from 'react'
import { Select } from "antd";
import sort from "../../assets/icons/arrow-sort.svg";
import './style.scss'
const SortProduct = ({ sortedProducts, setSortedProducts }) => {
    const [selectedOption, setSelectedOption] = useState("");
    const handleSelect = (value) => {
        setSelectedOption(value);
    };

    const handleAllClick = () => {
        setSelectedOption("");
    };

    useEffect(() => {
        let sortedArray = [...sortedProducts];
        if (selectedOption === "A to Z") {
            sortedArray.sort((a, b) => a.product.name.localeCompare(b.product.name));
        } else if (selectedOption === "Z to A") {
            sortedArray.sort((a, b) => b.product.name.localeCompare(a.product.name));
        } else if (selectedOption === "From cheap to expensive") {
            sortedArray.sort((a, b) => a.product.price - b.product.price);
        } else if (selectedOption === "From expensive to cheap") {
            sortedArray.sort((a, b) => b.product.price - a.product.price);
        }
        setSortedProducts(sortedArray);
    }, [selectedOption]);

    const { Option } = Select;

    return (
        <Select
            defaultValue=""
            value={selectedOption}
            onChange={handleSelect}
            suffixIcon={null}
            className="select"
            popupClassName="custom-dropdown"
        >
            <Option value="" onClick={handleAllClick}>
                 All
            </Option>
            <Option value="A to Z">A to Z</Option>
            <Option value="Z to A">Z to A</Option>
            <Option value="From cheap to expensive">From cheap to expensive</Option>
            <Option value="From expensive to cheap">From expensive to cheap</Option>
        </Select>
    )
}

export default SortProduct;
