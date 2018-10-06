import React from 'react';

const CanvasThumbnail = ({ canvas, get, goToCanvas }) => (
  <div
    className="canvas-thumbnail"
    onClick={() => goToCanvas(get(canvas, 'id'))}
    id={get(canvas, 'id')}
  >
    <h3>{get(canvas, 'name')}</h3>
    <img
      src={get(canvas, 'image')}
      height="80"
      width="160"
      alt={get(canvas, 'name')}
    />
    <pre>{get(canvas, 'id')}</pre>
  </div>
);

export default CanvasThumbnail;
