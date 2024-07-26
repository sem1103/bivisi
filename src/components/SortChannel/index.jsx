import React, { useEffect, useState } from 'react'
import './style.scss'
import { Select } from "antd";
import sort from "../../assets/icons/arrow-sort.svg";

const SortChannel = ({ sortedChannels, setSortedChannels }) => {
    const [selectedOption, setSelectedOption] = useState("");

    const handleSelect = (value) => {
        setSelectedOption(value);
    };

    const handleAllClick = () => {
        setSelectedOption("");
    };

    useEffect(() => {
        let sortedArray = [...sortedChannels];
        if (selectedOption === "A to Z") {
            sortedArray.sort((a, b) => a.username.localeCompare(b.username));
        } else if (selectedOption === "Z to A") {
            sortedArray.sort((a, b) => b.username.localeCompare(a.username));
        } 
        setSortedChannels(sortedArray);
    }, [selectedOption]);

    const { Option } = Select;

    return (
        <div className="custom-select">
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
        </Select>
        </div>
    )
}

export default SortChannel;
