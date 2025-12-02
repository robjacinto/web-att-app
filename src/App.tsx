import React from "react";
import Calendar from "./components/Calendar";

const App: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-gray-100 flex items-center justify-center">
      <Calendar />
    </div>
  );
};

export default App;
