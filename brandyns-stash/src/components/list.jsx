import { React, useState } from 'react'
import data from "./ListData.json"

function List(props) {
    //create a new array by filtering the original array
    const filteredData = data.filter((el) => {
        //if no input the return the original
        if (props.input === '') {
            return el;
        }
        const inputLower = props.input.toLowerCase();
            // Convert series to array if it's not already an array
            const seriesArray = Array.isArray(el.series) 
            ? el.series 
            : [el.series];

        //return the item which contains the user input
        return (
            el.name.toLowerCase().includes(inputLower) || 
            seriesArray.some(series => 
                series.toLowerCase().includes(inputLower)
            )
        );
    })
    return (
        <ul>
            {filteredData.map((item) => (
                <li key={item.id}>{item.name}</li>
            ))}
        </ul>
    )
}

export default List