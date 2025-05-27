import React from 'react';
import { useNavigate } from 'react-router-dom';

function List({ items }) {
    const navigate = useNavigate();

    return (
        <div>
            {items.length === 0 ? (
                <div style={{ 
                    textAlign: 'center', 
                    padding: '50px', 
                    color: 'white' 
                }}>
                    No items found.
                </div>
            ) : (
                <div className="character-grid">
                    {items.map((item) => (
                        <div 
                            key={item.id} 
                            className="character-grid-item"
                            onClick={() => navigate(`/item/${item.id}`)}
                            style={{ cursor: 'pointer' }}>
                            <img 
                                src={item.image} 
                                alt={item.name} 
                                className="character-image"
                                onError={(e) => {
                                    console.error('Image failed to load', item.image);
                                    e.target.src = '/placeholder.png'; // Fallback image
                                }}
                            />
                            <div className="character-info">
                                <p className="character-name">{item.name}</p>
                                <p className="character-series">
                                    {item.seriesFirst}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default List;