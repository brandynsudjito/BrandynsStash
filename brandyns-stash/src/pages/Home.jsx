import { React, useState } from 'react';
import TextField from "@mui/material/TextField";
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import List from '@components/list';

const Home = () => {
    const [inputText, setInputText] = useState("");
    const [searchType, setSearchType] = useState("all"); // Default to searching all fields
    
    let inputHandler = (e) => {
        var lowerCase = e.target.value.toLowerCase();
        setInputText(lowerCase);
    };

    const handleSearchTypeChange = (e) => {
        setSearchType(e.target.value);
    };

    return (
        <div className="home">
            <h1>Brandyn's Stash</h1>
            <div className="search-container" style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'flex-start' }}>
                <TextField
                    id="outlined-basic"
                    onChange={inputHandler}
                    variant="outlined"
                    label="Search"
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
                        label="Search In"
                    >
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="name">Name</MenuItem>
                        <MenuItem value="series">Series</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <List input={inputText} searchType={searchType} />
        </div>
    );
};

export default Home;