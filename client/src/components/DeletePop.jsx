import React from 'react';

// onClick={() => goToCanvas(get(canvas, 'id'))}

const DeletePop = ({  deleteCanvas, toggleShowDelete }) => {

  return (
    <div >
      <div>
        <h1>Delete Canvas?</h1>
        <button onClick={() => deleteCanvas(get(canvas, 'id'))}>Delete Canvas</button>
        <button onClick={toggleShowDelete}>Do Not Delete</button>
      </div>
    </div>


  );

}


export default DeletePop;