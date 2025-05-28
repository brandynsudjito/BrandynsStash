import { React, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import TextField from "@mui/material/TextField";
import { Select, MenuItem, FormControl, InputLabel, IconButton, CircularProgress, Box } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import List from '@components/list';
import { getItems } from '../firebase/itemService';

const Home = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [inputText, setInputText] = useState(searchParams.get('search') || "");
    const [searchType, setSearchType] = useState(searchParams.get('type') || "all");
    const [sortConfig, setSortConfig] = useState({
        key: searchParams.get('sortKey') || "",
        direction: searchParams.get('sortDir') || 'ascending'
    });
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch items when search or sort parameters change
    useEffect(() => {
        const fetchItems = async () => {
            setLoading(true);
            try {
                const fetchedItems = await getItems(
                    inputText, 
                    searchType, 
                    sortConfig.key, 
                    sortConfig.direction
                );
                setItems(fetchedItems);
            } catch (error) {
                console.error("Error fetching items:", error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchItems();
    }, [inputText, searchType, sortConfig]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
        setSearchParams({ 
            search: inputText, 
            type: searchType,
            sortKey: key,
            sortDir: direction
        });
    };

    const resetSort = () => {
        setSortConfig({ key: '', direction: 'ascending' });
        setSearchParams({ 
            search: inputText, 
            type: searchType,
            sortKey: '',
            sortDir: 'ascending'
        });
    };

    let inputHandler = (e) => {
        const lowerCase = e.target.value.toLowerCase();
        setInputText(lowerCase);
        setSearchParams({ 
            search: lowerCase, 
            type: searchType,
            sortKey: sortConfig.key,
            sortDir: sortConfig.direction
        });
    };

    const handleSearchTypeChange = (e) => {
        const newSearchType = e.target.value;
        setSearchType(newSearchType);
        setSearchParams({ 
            search: inputText, 
            type: newSearchType,
            sortKey: sortConfig.key,
            sortDir: sortConfig.direction
        });
    };

    // Update from URL parameters
    useEffect(() => {
        const searchParam = searchParams.get('search');
        const typeParam = searchParams.get('type');
        const sortKeyParam = searchParams.get('sortKey');
        const sortDirParam = searchParams.get('sortDir');
        
        if (searchParam) setInputText(searchParam);
        if (typeParam) setSearchType(typeParam);
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
            type: searchType,
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
                        {/* Search Type Dropdown */}
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
                            <InputLabel>Search In</InputLabel>
                            <Select
                                value={searchType}
                                onChange={handleSearchTypeChange}
                                label="Search In"
                            >
                                <MenuItem value="all">All</MenuItem>
                                <MenuItem value="name">Name</MenuItem>
                                <MenuItem value="series">Series</MenuItem>
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
                                <MenuItem value="series">Series</MenuItem>
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
                <List items={items} />
            </div>
        </div>
    );
};

export default Home;