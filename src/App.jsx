import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "layouts";

const App = () => {
  return (
    <Routes>
      <Route path="/*" element={<Layout />} />
      <Route path="/" element={<Navigate to="/home" replace />} />
    </Routes>
  );
};

export default App;
