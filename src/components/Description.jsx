import React, { useRef, useState } from "react";

const Description = ({ speaker, msg, color }) => {
  return (
    <div className="p-4 mb-2rounded-md shadow-sm flex items-center">
      <div>
        <strong className={color}>{speaker}</strong>
      </div>
      <div>
        <p className="ml-4 text-gray-700">{msg}</p>
      </div>
    </div>
  );
};

export default Description;
