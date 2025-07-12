import { React, useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import TextField from "@mui/material/TextField";
import { Select, MenuItem, FormControl, InputLabel, IconButton, CircularProgress, Box } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import MenuIcon from '@mui/icons-material/Menu'; // Added import for menu icon
import List from '@components/list';
import { getItems, getAllSeries } from '../firebase/itemService';

const Home = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [inputText, setInputText] = useState(searchParams.get('search') || "");
    const [selectedSeries, setSelectedSeries] = useState(searchParams.get('series') || "all");
    const [sortConfig, setSortConfig] = useState({
        key: searchParams.get('sortKey') || "name",
        direction: searchParams.get('sortDir') || 'ascending'
    });
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [seriesOptions, setSeriesOptions] = useState([]);
    const [loadingSeries, setLoadingSeries] = useState(true);
    const [debouncedInputText, setDebouncedInputText] = useState(inputText);
    const [menuExpanded, setMenuExpanded] = useState(false); // Start collapsed by default

    // Determine if any filters are active for indicator
    const filtersActive = inputText || selectedSeries !== "all" || sortConfig.key !== "name" || sortConfig.direction !== "ascending";

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedInputText(inputText);
        }, 500); // 500ms delay

        return () => clearTimeout(timer);
    }, [inputText]);

    // Auto-expand menu on desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                setMenuExpanded(true); // Always expanded on desktop
            }
        };
        
        window.addEventListener('resize', handleResize);
        handleResize(); // Check on initial load
        
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
                    debouncedInputText, 
                    sortConfig.key, 
                    sortConfig.direction,
                    selectedSeries
                );
                setItems(fetchedItems);
            } catch (error) {
                console.error("Error fetching items:", error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchItems();
    }, [debouncedInputText, selectedSeries, sortConfig]);

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
        setSortConfig({ key: 'name', direction: 'ascending' });
        setSearchParams({ 
            search: inputText, 
            series: selectedSeries,
            sortKey: 'name',
            sortDir: 'ascending'
        });
    };

    // Update URL parameters when debounced search changes
    useEffect(() => {
        setSearchParams({ 
            search: debouncedInputText, 
            series: selectedSeries,
            sortKey: sortConfig.key,
            sortDir: sortConfig.direction
        });
    }, [debouncedInputText, setSearchParams, selectedSeries, sortConfig]);

    let inputHandler = (e) => {
        const lowerCase = e.target.value.toLowerCase();
        setInputText(lowerCase);
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
        setSortConfig({
            key: sortKeyParam || 'name',
            direction: sortDirParam || 'ascending'
        });
    }, [searchParams]);

    const handleClear = () => {
        setInputText("");
        setDebouncedInputText(""); // Immediately update the debounced text
        setSearchParams({
            search: "",
            series: selectedSeries,
            sortKey: sortConfig.key,
            sortDir: sortConfig.direction
        });
    };

    const saveScrollPosition = () => {
        const currentPosition = window.scrollY;
        sessionStorage.setItem('homeScrollPosition', currentPosition);
    };

    // Restore scroll position when returning
    useEffect(() => {
        const restorePosition = () => {
            const savedPosition = sessionStorage.getItem('homeScrollPosition');
            
            if (savedPosition) {
                const position = parseInt(savedPosition);
                window.scrollTo(0, position);
                sessionStorage.removeItem('homeScrollPosition');
            }
        };
        
        const timer = setTimeout(restorePosition, 100);
        return () => clearTimeout(timer);
    }, []); 

    // Also restore when items finish loading
    useEffect(() => {
        if (!loading && items.length > 0) {
            const savedPosition = sessionStorage.getItem('homeScrollPosition');
            if (savedPosition) {
                console.log('Restoring position after items loaded:', savedPosition);
                setTimeout(() => {
                    window.scrollTo(0, parseInt(savedPosition));
                }, 50);
            }
        }
    }, [loading, items]);

    return (
        <div className="home">
            <div className="header-container" style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                width: '100%',
                zIndex: 1000,
                backgroundColor: menuExpanded ? '#242424' : 'transparent',
                boxShadow: menuExpanded ? '0 2px 4px rgba(0,0,0,0.2)' : 'none',
                transition: 'background-color 0.3s ease, box-shadow 0.3s ease'
            }}>
                {/* Floating hamburger button when collapsed */}
                {!menuExpanded && (
                    <div style={{
                        position: 'absolute',
                        top: '10px',
                        right: '40px',
                    }}>
                        <IconButton 
                            onClick={() => setMenuExpanded(true)}
                            sx={{ 
                                color: 'white',
                                backgroundColor: 'rgba(36, 36, 36, 0.8)',
                                position: 'relative',
                                width: '48px',
                                height: '48px',
                                '&:hover': {
                                    backgroundColor: 'rgba(66, 66, 66, 0.9)',
                                }
                            }}
                            aria-label="expand search panel"
                        >
                            <MenuIcon />
                            {filtersActive && (
                                <div style={{
                                    position: 'absolute',
                                    top: 5,
                                    right: 5,
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    backgroundColor: '#ff5722'
                                }} />
                            )}
                        </IconButton>
                    </div>
                )}
                
                {/* Expanded header content */}
                <div style={{
                    maxHeight: menuExpanded ? '300px' : '0px',
                    overflow: 'hidden',
                    opacity: menuExpanded ? 1 : 0,
                    transition: 'max-height 0.3s ease, opacity 0.3s ease',
                }}>
                    {/* Header Bar with Title and Close Button */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0px 30px',
                        borderBottom: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Brandyn's Stash</h1>
                        
                        <IconButton 
                            onClick={() => setMenuExpanded(false)}
                            sx={{ color: 'white',
                                width: '48px',
                                height: '48px',
                                }}
                            aria-label="collapse search panel"
                        >
                            <ClearIcon />
                        </IconButton>
                    </div>
                    
                    {/* Search Panel */}
                    <div style={{
                        padding: '16px',
                        boxSizing: 'border-box',
                    }}>
                        <Box 
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px',
                                width: '100%',
                                boxSizing: 'border-box',
                                maxWidth: '1000px',
                                margin: '0 auto',
                                px: { xs: 2, sm: 3, md: 0 }
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
                                                    position: 'absolute',
                                                    right: '14px',
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
                </div>
            </div>

            {/* Spacer that adjusts based on menu state */}
            <div style={{ 
                height: menuExpanded ? '210px' : '0px',
                transition: 'height 0.3s ease',
                marginBottom: menuExpanded ? '24px' : '0'
            }}></div>
            
            <div className="content-container">
                {loading ? (
                    <div className="loading">Loading...</div>
                ) : (
                    <List items={items} onItemClick={saveScrollPosition}/>
                )}
            </div>
        </div>
    );
};

export default Home;