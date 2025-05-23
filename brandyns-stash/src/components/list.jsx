import { React, useState, useMemo } from 'react'
import data from "./ListData.json"
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';

function List({ input }) {
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: 'ascending'
    });

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

            return (
                el.name.toLowerCase().includes(inputLower) || 
                seriesArray.some(series => 
                    series.toLowerCase().includes(inputLower)
                )
            );
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
    }, [input, sortConfig]);

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
            {/* Sorting Controls */}
            <div className="sort-controls">
                <FormControl 
                    variant="outlined" 
                    sx={{ 
                        minWidth: 200,
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: 'white',
                            },
                            '&:hover fieldset': {
                                borderColor: 'white',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: 'white',
                            },
                        },
                        '& .MuiInputLabel-root': {
                            color: 'white',
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                            color: 'white',
                        },
                        '& .MuiSelect-icon': {
                            color: 'white',
                        },
                        '& .MuiSelect-select': {
                            color: 'white',
                        }
                    }}
                >
                    <InputLabel>Sort By</InputLabel>
                    <Select
                        value={sortConfig.key || ''}
                        onChange={(e) => requestSort(e.target.value)}
                        label="Sort By"
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {sortOptions.map((option) => (
                            <MenuItem key={option.key} value={option.key}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {sortConfig.key && (
                    <button 
                        onClick={() => setSortConfig({ 
                            key: sortConfig.key, 
                            direction: sortConfig.direction === 'ascending' 
                                ? 'descending' 
                                : 'ascending' 
                        })}
                        style={{
                            backgroundColor: 'transparent',
                            border: '1px solid white',
                            color: 'white',
                            padding: '10px 16px',
                            cursor: 'pointer',
                            borderRadius: '4px'
                        }}
                    >
                        {sortConfig.direction === 'ascending' ? '▲' : '▼'}
                    </button>
                )}

                {sortConfig.key && (
                    <button 
                        onClick={() => setSortConfig({ key: null, direction: 'ascending' })}
                        style={{
                            backgroundColor: 'transparent',
                            border: '1px solid white',
                            color: 'white',
                            padding: '10px 16px',
                            cursor: 'pointer',
                            borderRadius: '4px'
                        }}
                    >
                        Reset
                    </button>
                )}
            </div>

            {/* Grid Display */}
            <div className="character-grid">
                {processedData.map((item) => (
                    <div key={item.id} className="character-grid-item">
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