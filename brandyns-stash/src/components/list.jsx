import { React, useState } from 'react'
import data from "./ListData.json"

function List({ input }) {
    const filteredData = data.filter((el) => {
        if (input === '') {
            return true;
        }

        const inputLower = input.toLowerCase();

        const seriesArray = Array.isArray(el.series) 
            ? el.series 
            : [el.series];

        return (
            el.name.toLowerCase().includes(inputLower) || 
            seriesArray.some(series => 
                series.toLowerCase().includes(inputLower)
            )
        );
    });

    return (
        <div className="character-grid">
            {filteredData.map((item) => (
                <div key={item.id} className="character-grid-item">
                    <img 
                        src={item.image} 
                        alt={item.name} 
                        className="character-image"
                    />
                    <p className="character-name">{item.name}</p>
                </div>
            ))}
        </div>
    )
}





export default List