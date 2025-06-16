import { React, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import TextField from "@mui/material/TextField";
import { Select, MenuItem, FormControl, InputLabel, IconButton, CircularProgress, Box } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import List from '@components/list';
import { getItems, getAllSeries } from '../firebase/itemService';

const Home = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [inputText, setInputText] = useState(searchParams.get('search') || "");
    const [selectedSeries, setSelectedSeries] = useState(searchParams.get('series') || "all");
    const [sortConfig, setSortConfig] = useState({
        key: searchParams.get('sortKey') || "",
        direction: searchParams.get('sortDir') || 'ascending'
    });
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [seriesOptions, setSeriesOptions] = useState([]);
    const [loadingSeries, setLoadingSeries] = useState(true);

    // Fetch all series on component mount
    useEffect(() => {
        const fetchSeries = async () => {
            setLoadingSeries(true);
            try {
                const series = await getAllSeries();
                setSeriesOptions(series);
            } catch (error) {
                console.error("Error fetching series:", error);
            } finally {
                setLoadingSeries(false);
            }
        };
        
        fetchSeries();
    }, []);

    // Fetch items when search, series, or sort parameters change
    useEffect(() => {
        const fetchItems = async () => {
            setLoading(true);
            try {
                const fetchedItems = await getItems(
                    inputText, 
                    // selectedSeries === "all" ? "all" : "series",
                    sortConfig.key, 
                    sortConfig.direction,
                    selectedSeries // Pass the selected series
                );
                setItems(fetchedItems);
            } catch (error) {
                console.error("Error fetching items:", error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchItems();
    }, [inputText, selectedSeries, sortConfig]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
        setSearchParams({ 
            search: inputText, 
            series: selectedSeries,
            sortKey: key,
            sortDir: direction
        });
    };

    const resetSort = () => {
        setSortConfig({ key: '', direction: 'ascending' });
        setSearchParams({ 
            search: inputText, 
            series: selectedSeries,
            sortKey: '',
            sortDir: 'ascending'
        });
    };

    let inputHandler = (e) => {
        const lowerCase = e.target.value.toLowerCase();
        setInputText(lowerCase);
        setSearchParams({ 
            search: lowerCase, 
            series: selectedSeries,
            sortKey: sortConfig.key,
            sortDir: sortConfig.direction
        });
    };

    const handleSeriesChange = (e) => {
        const newSeries = e.target.value;
        setSelectedSeries(newSeries);
        setSearchParams({ 
            search: inputText, 
            series: newSeries,
            sortKey: sortConfig.key,
            sortDir: sortConfig.direction
        });
    };

    // Update from URL parameters
    useEffect(() => {
        const searchParam = searchParams.get('search');
        const seriesParam = searchParams.get('series');
        const sortKeyParam = searchParams.get('sortKey');
        const sortDirParam = searchParams.get('sortDir');
        
        if (searchParam !== null) setInputText(searchParam);
        if (seriesParam) setSelectedSeries(seriesParam);
        if (sortKeyParam || sortDirParam) {
            setSortConfig({
                key: sortKeyParam || '',
                direction: sortDirParam || 'ascending'
            });
        }
    }, [searchParams]);

    const handleClear = () => {
        setInputText("");
        setSearchParams({
            search: "",
            series: selectedSeries,
            sortKey: sortConfig.key,
            sortDir: sortConfig.direction
        });
    };

    return (
        <div className="home">
            <div className="header-container">
                <h1>Brandyn's Stash</h1>
                
                {/* Main container for search and filters */}
                <Box 
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        width: '100%',
                        maxWidth: '1000px',
                        margin: '0 auto'
                    }}
                >
                    {/* Search field - always full width */}
                    <TextField
                        id="outlined-basic"
                        onChange={inputHandler}
                        value={inputText}
                        variant="outlined"
                        label="Search"
                        placeholder={selectedSeries !== "all" ? `Search within ${selectedSeries}...` : "Search all items..."}
                        InputLabel={{ shrink: true }}
                        slotProps={{
                            input:{
                                endAdornment: inputText && (
                                    <IconButton
                                        aria-label="clear search"
                                        onClick={handleClear}
                                        edge="end"
                                        sx={{ 
                                            color: 'white',
                                            visibility: inputText ? 'visible' : 'hidden' 
                                        }}
                                    >
                                        <ClearIcon/>
                                    </IconButton>
                                )
                            }
                        }}
                        sx={{
                            width: '100%',
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: 'white' },
                                '&:hover fieldset': { borderColor: 'white' },
                                '&.Mui-focused fieldset': { borderColor: 'white' },
                            },
                            '& .MuiInputLabel-root': { color: 'white' },
                            '& .MuiInputLabel-root.Mui-focused': { color: 'white' },
                            '& .MuiInputBase-input': { color: 'white' }
                        }}
                    />
                    
                    {/* Filter controls - always in a row, but wrapping on mobile */}
                    <Box 
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: '10px',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {/* Series Dropdown */}
                        <FormControl
                            variant="outlined"
                            sx={{
                                minWidth: 200,
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': { borderColor: 'white' },
                                    '&:hover fieldset': { borderColor: 'white' },
                                    '&.Mui-focused fieldset': { borderColor: 'white' },
                                },
                                '& .MuiInputLabel-root': { color: 'white' },
                                '& .MuiInputLabel-root.Mui-focused': { color: 'white' },
                                '& .MuiSelect-icon': { color: 'white' },
                                '& .MuiSelect-select': { color: 'white' }
                            }}
                        >
                            <InputLabel>Filter by Series</InputLabel>
                            <Select
                                value={selectedSeries}
                                onChange={handleSeriesChange}
                                label="Filter by Series"
                                disabled={loadingSeries}
                            >
                                <MenuItem value="all">All Series</MenuItem>
                                {loadingSeries ? (
                                    <MenuItem disabled>
                                        <CircularProgress size={20} />
                                    </MenuItem>
                                ) : (
                                    seriesOptions.map((series) => (
                                        <MenuItem key={series} value={series}>
                                            {series}
                                        </MenuItem>
                                    ))
                                )}
                            </Select>
                        </FormControl>
                        
                        {/* Sort Dropdown */}
                        <FormControl
                            variant="outlined"
                            sx={{
                                minWidth: 150,
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': { borderColor: 'white' },
                                    '&:hover fieldset': { borderColor: 'white' },
                                    '&.Mui-focused fieldset': { borderColor: 'white' },
                                },
                                '& .MuiInputLabel-root': { color: 'white' },
                                '& .MuiInputLabel-root.Mui-focused': { color: 'white' },
                                '& .MuiSelect-icon': { color: 'white' },
                                '& .MuiSelect-select': { color: 'white' }
                            }}
                        >
                            <InputLabel>Sort By</InputLabel>
                            <Select
                                value={sortConfig.key}
                                onChange={(e) => requestSort(e.target.value)}
                                label="Sort By"
                            >
                                <MenuItem value=""><em>None</em></MenuItem>
                                <MenuItem value="name">Name</MenuItem>
                            </Select>
                        </FormControl>

                        {/* Sort Direction and Reset Buttons */}
                        {sortConfig.key && (
                            <>
                                <button
                                    onClick={() => requestSort(sortConfig.key)}
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
                                <button
                                    onClick={resetSort}
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
                            </>
                        )}
                    </Box>
                </Box>
            </div>
            
            <div className="content-container">
                {loading ? (
                    <div className="loading">Loading...</div>
                ) : (
                    <List items={items} />
                )}
            </div>
        </div>
    );
};

export default Home;