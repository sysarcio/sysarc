import React from 'react';
import DeletePop from './DeletePop.jsx'


const CanvasThumbnail = ({ toggleShowDelete, showDelete, canvas, get, goToCanvas, deleteCanvas}) => {

  console.log('showDelete', showDelete)
  return (     
      <div
        className="canvas-thumbnail"
        id={get(canvas, 'id')}>
      <button className='canvas-delete-btn' onClick={() => deleteCanvas(get(canvas, 'id'))}>
        <span>Delete Canvas</span>
        X
        </button>
       <div>
        <h3 onClick={() => goToCanvas(get(canvas, 'id'))}>{get(canvas, 'name')}</h3>
       
        <img
          onClick={() => goToCanvas(get(canvas, 'id'))}
          src={get(canvas, 'image')}
          height="40"
          width="160"
          alt={get(canvas, 'name')}
        />
        <pre>{get(canvas, 'id')}</pre>
      </div>; 
      </div>

    
  );

}
  

export default CanvasThumbnail;
