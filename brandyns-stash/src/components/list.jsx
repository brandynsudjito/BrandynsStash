import { React, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom';
import data from "./ListData.json"
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';

function List({ input, searchType = 'all', sortConfig }) {
    const navigate = useNavigate();
    // const [sortConfig, setSortConfig] = useState({
    //     key: null,
    //     direction: 'ascending'
    // });

    const getSortedValue = (item, key) => {
        switch(key) {
            case 'name':
                return item.name;
            case 'series':
                return Array.isArray(item.series) 
                    ? item.series[0] 
                    : item.series;
            default:
                return item[key];
        }
    };

    const processedData = useMemo(() => {
        const filteredData = data.filter((el) => {
            if (input === '') {
                return true;
            }

            const inputLower = input.toLowerCase();

            const seriesArray = Array.isArray(el.series) 
                ? el.series 
                : [el.series];

            switch(searchType){
                case 'name':
                    return el.name.toLowerCase().includes(inputLower);
                case 'series':
                    return seriesArray.some(series => 
                        series.toLowerCase().includes(inputLower)
                    );
                case 'all':
                default:
                    return (
                        el.name.toLowerCase().includes(inputLower) || 
                        seriesArray.some(series => 
                            series.toLowerCase().includes(inputLower)
                        )
                    );
            }
        });

        if (sortConfig.key) {
            return [...filteredData].sort((a, b) => {
                const valueA = getSortedValue(a, sortConfig.key);
                const valueB = getSortedValue(b, sortConfig.key);

                if (typeof valueA === 'string' && typeof valueB === 'string') {
                    const comparison = valueA.localeCompare(valueB);
                    return sortConfig.direction === 'ascending' 
                        ? comparison 
                        : -comparison;
                }

                if (valueA < valueB) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (valueA > valueB) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }

        return filteredData;
    }, [input, searchType, sortConfig]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (
            sortConfig.key === key && 
            sortConfig.direction === 'ascending'
        ) {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const sortOptions = [
        { key: 'name', label: 'Name' },
        { key: 'series', label: 'Series' }
    ];

    return (
        <div>
            {/* Grid Display */}
            <div className="character-grid">
                {processedData.map((item) => (
                    <div 
                        key={item.id} 
                        className="character-grid-item"
                        onClick={() => navigate(`/item/${item.id}`)}
                        style={{ cursor: 'pointer' }}>
                        <img 
                            src={item.image} 
                            alt={item.name} 
                            className="character-image"
                        />
                        <div className="character-info">
                            <p className="character-name">{item.name}</p>
                            <p className="character-series">
                                {Array.isArray(item.series) 
                                    ? item.series[0] 
                                    : item.series}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}





export default List