import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getItemById } from '../firebase/itemService';
import { CircularProgress } from '@mui/material';

const ItemDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchItem = async () => {
            setLoading(true);
            try {
                const data = await getItemById(id);
                setItem(data);
            } catch (error) {
                console.error("Error fetching item details:", error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchItem();
    }, [id]);

    if (loading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                height: '100vh'
            }}>
                <CircularProgress sx={{ color: 'white' }} />
            </div>
        );
    }

    if (!item) {
        return (
            <div style={{ 
                textAlign: 'center', 
                padding: '50px', 
                color: 'white' 
            }}>
                Item not found.
                <button 
                    onClick={() => navigate('/')}
                    style={{
                        backgroundColor: 'transparent',
                        border: '1px solid white',
                        color: 'white',
                        padding: '10px 16px',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        marginTop: '20px'
                    }}
                >
                    Return to Home
                </button>
            </div>
        );
    }

    return (
        <div className="item-detail-container">
            <button 
                onClick={() => navigate(-1)}
                style={{
                    backgroundColor: 'transparent',
                    border: '1px solid white',
                    color: 'white',
                    padding: '10px 16px',
                    cursor: 'pointer',
                    marginBottom: '20px'
                }}
            >
                Back
            </button>

            <div className="item-detail-content">
                <div className="item-detail-image">
                    <img 
                        src={item.image} 
                        alt={item.name}
                        onError={(e) => {
                            console.error('Image failed to load', item.image);
                            e.target.src = '/placeholder.png';
                        }}
                        style={{ 
                            maxWidth: '100%', 
                            maxHeight: '500px', 
                            objectFit: 'contain' 
                        }}
                    />
                </div>

                <div className="item-detail-info">
                    <h1>{item.name}</h1>
                    
                    <div className="detail-section">
                        <h2></h2>
                        <p>Series: {item.series}</p>
                        <p>Size class: {item.size}</p>
                        <p>Brand: {item.brand}</p>
                        <p>Price: ${item.price}</p>
                    </div>
                        
                    {item.description && (
                        <div className="detail-section">
                            <h2>Description</h2>
                            <p>{item.description}</p>
                        </div>
                    )}

                    {/* Add more details as needed */}
                    {/* {item.additionalInfo && (
                        <div className="detail-section">
                            <h2>Additional Information</h2>
                            <p>{item.additionalInfo}</p>
                        </div>
                    )} */}
                </div>
            </div>
        </div>
    );
};

export default ItemDetail;