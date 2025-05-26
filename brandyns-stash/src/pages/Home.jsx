import { React, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import TextField from "@mui/material/TextField";
import { Select, MenuItem, FormControl, InputLabel, IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear'; // Make sure to import this
import List from '@components/list';

const Home = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [inputText, setInputText] = useState(searchParams.get('search') || "");
    const [searchType, setSearchType] = useState(searchParams.get('type') || "all"); // Default to searching all fields
    const [sortConfig, setSortConfig] = useState({
        key: "",
        direction: 'ascending'
    });

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const resetSort = () => {
        setSortConfig({ key: '', direction: 'ascending' });
    };

    let inputHandler = (e) => {
        var lowerCase = e.target.value.toLowerCase();
        setInputText(lowerCase);
        setSearchParams({ 
            search: lowerCase, 
            type: searchType 
        });
    };

    const handleSearchTypeChange = (e) => {
        const newSearchType = e.target.value;
        setSearchType(e.target.value);
        setSearchParams({ 
            search: inputText, 
            type: newSearchType 
        });
    };

    //update te TextField value with the URL parameter
    useEffect(() => {
        const searchParam = searchParams.get('search');
        const typeParam = searchParams.get('type');
        if (searchParam) setInputText(searchParam);
        if (typeParam) setSearchType(typeParam); 
    }, [searchParams]);

    const handleClear = () => {
        setInputText("");
        setSearchParams({
            search: "",
            type: searchType
        });
    };

    return (
        <div className="home">
            <div className="header-container">
                <h1>Brandyn's Stash</h1>
                <div className="search-container" style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'flex-start' }}>
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
                            maxWidth: '450px',
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
                            '& .MuiInputBase-input': {
                                color: 'white',
                            }
                        }}
                    />
                    <FormControl
                        variant="outlined"
                        sx={{
                            minWidth: 150,
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
                        <InputLabel>Search In</InputLabel>
                        <Select
                            value={searchType}
                            onChange={handleSearchTypeChange}
                            label="Search By"
                        >
                            <MenuItem value="all">All</MenuItem>
                            <MenuItem value="name">Name</MenuItem>
                            <MenuItem value="series">Series</MenuItem>
                        </Select>
                    </FormControl>
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

                    {sortConfig.key && (
                        <>
                            <button
                                onClick={() =>
                                    setSortConfig({
                                        key: sortConfig.key,
                                        direction: sortConfig.direction === 'ascending'
                                            ? 'descending'
                                            : 'ascending'
                                    })
                                }
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

                </div>
            </div>
            <div className="content-container">
                <List input={inputText} searchType={searchType} sortConfig={sortConfig}/>
            </div>
        </div>
    );
};

export default Home;