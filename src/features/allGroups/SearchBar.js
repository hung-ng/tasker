import React from 'react';

const SearchBar = (props) => {

    const handleOnChange = (e) => {
        const userInput = e.target.value;
        props.setSearchTerm(userInput)
    }

    return (
        <div className="searchbar">
            <form>
                <input onChange={handleOnChange} value={props.value} type="search" placeholder="Search" />
            </form>
        </div>
    )
}

export default SearchBar;