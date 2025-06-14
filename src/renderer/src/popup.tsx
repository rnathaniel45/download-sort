import React, { useState } from 'react';
function Popup({folder, changeDesc, desc}: {folder: string, desc: string, changeDesc: (folder: string, desc: string) => void}) {
  const [showPopup, setShowPopup] = useState(false);
  return (
    <div>
      <button onClick={() => setShowPopup(true)} style = {{height: "25px", width: "100px", borderRadius: "5px", border: "1px solid #ccc", padding: "5px", boxSizing: "border-box"}}>Description</button>

      {showPopup && (
        <div
          style={{
            position: 'fixed',
            top: '30%',
            left: '50%',
            transform: 'translate(-50%, -30%)',
            backgroundColor: '#101010',
            padding: '20px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            borderRadius: '10px',
            zIndex: 1000,
            transition: 'opacity 0.3s ease',
            opacity: showPopup ? 0.9 : 0,
            height: '500px',
            width: '700px',
          }}
        >
          <p>Enter your description for folder: {folder}</p>
          <textarea id = "description" defaultValue={desc} style = {{width: "100%", height: "450px", borderRadius: "5px", border: "1px solid #ccc", padding: "5px", boxSizing: "border-box"}} />
          <button onClick={() => setShowPopup(false)}>Close</button>
          <button onClick={() => {
            changeDesc(folder, (document.getElementById("description") as HTMLTextAreaElement).value);
            setShowPopup(false);
          }}>Save</button>
        </div>
      )}

      {showPopup && (
        <div
          onClick={() => setShowPopup(false)}
          style={{
            position: 'fixed',
            top: 0, left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.3)',
            zIndex: 999
          }}
        />
      )}
    </div>
  );
}

export default Popup;