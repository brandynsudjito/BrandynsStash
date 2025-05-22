import { React, useState, useMemo } from 'react'
import data from "./ListData.json"

function List({ input }) {
    // Sorting configuration state
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: 'ascending'
    });

    // Sorting function with flexibility for future expansion
    const getSortedValue = (item, key) => {
        switch(key) {
            case 'name':
                return item.name;
            case 'series':
                // Handle both array and string series, taking first value
                return Array.isArray(item.series) 
                    ? item.series[0] 
                    : item.series;
            // Easy to add more cases in the future
            default:
                return item[key];
        }
    };

    // Sorting and filtering logic
    const processedData = useMemo(() => {
        // First, filter the data
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

        // Then sort if needed
        if (sortConfig.key) {
            return [...filteredData].sort((a, b) => {
                const valueA = getSortedValue(a, sortConfig.key);
                const valueB = getSortedValue(b, sortConfig.key);

                // Case-insensitive string comparison
                if (typeof valueA === 'string' && typeof valueB === 'string') {
                    const comparison = valueA.localeCompare(valueB);
                    return sortConfig.direction === 'ascending' 
                        ? comparison 
                        : -comparison;
                }

                // Fallback for other types
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

    // Sort request handler
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

    // Sorting options (easily expandable)
    const sortOptions = [
        { key: 'name', label: 'Name' },
        { key: 'series', label: 'Series' }
        // Easy to add more options in the future
    ];

    return (
        <div>
            {/* Sorting Controls */}
            <div className="sort-controls">
                <select 
                    onChange={(e) => requestSort(e.target.value)}
                    value={sortConfig.key || ''}
                >
                    <option value="">Sort By</option>
                    {sortOptions.map((option) => (
                        <option key={option.key} value={option.key}>
                            {option.label}
                        </option>
                    ))}
                </select>

                {sortConfig.key && (
                    <button 
                        onClick={() => setSortConfig({ 
                            key: sortConfig.key, 
                            direction: sortConfig.direction === 'ascending' 
                                ? 'descending' 
                                : 'ascending' 
                        })}
                    >
                        {sortConfig.direction === 'ascending' ? '▲' : '▼'}
                    </button>
                )}

                {sortConfig.key && (
                    <button 
                        onClick={() => setSortConfig({ key: null, direction: 'ascending' })}
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