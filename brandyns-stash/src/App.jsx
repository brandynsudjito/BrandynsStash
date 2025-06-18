import { useState } from 'react'
import Home from '@pages/Home'
import ItemDetail from '@components/ItemDetail';
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import './App.css'

function App() {

  return (
    <>
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/item/:id" element={<ItemDetail />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
