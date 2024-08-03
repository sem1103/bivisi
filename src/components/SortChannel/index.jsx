import React, { useEffect, useState } from 'react'
import './style.scss'
import Select from 'react-select';

const SortChannel = ({ sortedChannels, setSortedChannels }) => {
    const [selectedOption, setSelectedOption] = useState("");

    const filters = [
        {
            value: '',
            label: 'All'
        },
        {
            value: 'option1',
            label: 'A to Z'
        },
        {
            value: 'option2',
            label: 'Z to A'
        }
    ]

    const selectStyles = {
        control: (baseStyles) => ({
            ...baseStyles,
            background: 'var(--primaryColor)',
            borderRadius: '16px',
            minWidth: '230px',
            textAlign: 'center',
            '@media (max-width: 600px)': {
                minWidth: '100px',
                maxWidth: '120px',
            }
        }),
        option: (styles, { isFocused, isSelected }) => ({
            ...styles,
            backgroundColor: isSelected ? '#0087cc' : isFocused ? 'var(--backgroundColor)' : 'none',
            color: 'var(--textColor)',
            cursor: 'pointer',
            margin: '0 0 5px 0',
            borderRadius: '8px'
        }),
        menu: (styles) => (
            {
                ...styles,
                borderRadius: '12px',
                background: 'var(--primaryColor)',
                minWidth: '150px',
                right: 0, // Смещение меню вправо

            }
        ),
        menuList: (styles) => ({
            ...styles,
            opacity: 0.7,
            padding: '5px 10px',

        }),
        singleValue: (styles) => ({
            ...styles,
            color: 'var(--textColor)',
        }),
        placeholder: (styles) => ({
            ...styles,
            color: 'var(--textColor)',
            opacity: 0.8
        })
    }

    const handleSelect = (value) => {
        setSelectedOption(value.value);
    };



    useEffect(() => {
        let sortedArray = [...sortedChannels];
        if (selectedOption === "option1") {
            sortedArray.sort((a, b) => (a.username > b.username ? 1 : -1));
        } else if (selectedOption === "option2") {
            sortedArray.sort((a, b) => (a.username < b.username ? 1 : -1));
        }

        setSortedChannels(sortedArray);
    }, [selectedOption]);


    return (
        <div className="custom-select">
            <Select
                defaultValue={filters[0]}
                placeholder='All'
                styles={selectStyles}
                options={filters}
                onChange={handleSelect}
                menuPlacement="auto"
                isSearchable={false}

            />
        </div>
    )
}

export default SortChannel;
