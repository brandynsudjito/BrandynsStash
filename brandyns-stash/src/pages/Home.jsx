import { React, useState } from 'react';
import TextField from "@mui/material/TextField";
import List from '@components/list';

const Home = () => {

    return (
        <>
            <div className="home">
                <h1>Brandyn's Stash</h1>
                <div className="search">
                    <TextField
                        id="outlined-basic"
                        variant="outlined"
                        fullWidth
                        label="Search"
                    />
                </div>
                <List />
            </div>
        </>
    );
};

export default Home;