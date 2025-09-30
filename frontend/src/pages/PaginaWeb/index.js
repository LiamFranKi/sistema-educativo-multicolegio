import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PaginaWebDashboard from './PaginaWebDashboard';
import PaginasWebList from './PaginasWebList';
import PaginaWebForm from './PaginaWebForm';

const PaginaWeb = () => {
  return (
    <Routes>
      <Route index element={<PaginaWebDashboard />} />
      <Route path="paginas" element={<PaginasWebList />} />
      <Route path="paginas/nueva" element={<PaginaWebForm />} />
      <Route path="paginas/:id" element={<PaginaWebForm />} />
    </Routes>
  );
};

export default PaginaWeb;
