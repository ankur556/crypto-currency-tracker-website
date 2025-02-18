import React from 'react';

const RefreshButton = ({ onClick }) => {
  return (
    <button onClick={onClick} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
      Refresh Data
    </button>
  );
};

export default RefreshButton;
