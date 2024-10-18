import React, { useRef } from "react";
import TWITCHBG2 from './TWITCHBG2.jpg'; // Relative path to the image

const Join = () => {
  const inputRefs = useRef([]);

  const handleInputChange = (e, index) => {
    const value = e.target.value;

    // Move to the next input if the current input has a value
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }

    // Move to the previous input if the current input is empty
    if (!value && index > 0) {
      inputRefs.current[index - 1].focus();
    }

    console.log(`Input ${index} changed to:`, value);
  };

  const handleKeyDown = (e, index) => {
    // Allow only numbers and letters
    if (!/[0-9a-zA-Z]/.test(e.key) && e.key !== "Backspace") {
      e.preventDefault();
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url(${TWITCHBG2})`, // Use the imported image
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="p-6 rounded-lg shadow-lg" style={{ backgroundColor: '#0D120D' }}>
        <div className="flex space-x-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <input
              key={index}
              maxLength={1} // Limit input to one character
              className="w-12 h-12 text-center border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 bg-transparent text-white"
              ref={(el) => (inputRefs.current[index] = el)} // Attach ref to each input
              onChange={(e) => handleInputChange(e, index)} // Handle input change
              onKeyDown={(e) => handleKeyDown(e, index)} // Handle key down to restrict input
              style={{ color: '#FFFFFF' }}
            />
          ))}
        </div>
        <button className="bg-violet-900 hover:bg-violet-700 text-white px-4 py-2 rounded-lg transition-all mt-4">
          Join Stream
        </button>
      </div>
    </div>
  );
};

export default Join;
