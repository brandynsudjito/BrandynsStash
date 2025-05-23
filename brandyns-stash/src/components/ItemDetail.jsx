import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import data from "./ListData.json";

const ItemDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Find the specific item based on the ID
    const item = data.find(item => item.id === parseInt(id));

    if (!item) {
        return <div>item not found</div>;
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
                <div className="item-detail-info">
                    <h1>{item.name}</h1>
                    
                    <div className="detail-section">
                        <h2>
                            {Array.isArray(item.series) 
                                    ? item.series[0] 
                                    : item.series}
                        </h2>
                    </div>

                    {item.description && (
                        <div className="detail-section">
                            <h2>Description</h2>
                            <p>{item.description}</p>
                        </div>
                    )}

                    {/* Add more details as needed */}
                    {item.additionalInfo && (
                        <div className="detail-section">
                            <h2>Additional Information</h2>
                            <p>{item.additionalInfo}</p>
                        </div>
                    )}
                    <div className="item-detail-image">
                        <img 
                            src={item.image} 
                            alt={item.name}
                            
                            style={{ 
                                maxWidth: '100%', 
                                maxHeight: '500px', 
                                objectFit: 'contain' 
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItemDetail;