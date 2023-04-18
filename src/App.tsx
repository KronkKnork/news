import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NewsPage from './pages/NewsPage';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';


const darkTheme = createTheme({
  palette: {
    primary: {
      main: '#454646',
    },
    secondary: {
      main: '#b388ff',
    },
    background: {
      default: '#1e1e1e',
    },
    text: {
      primary: '#9778ce',
      secondary: '#969696',
    }
  },
  typography: {
    body2: {
      fontSize: 10,
    },
  }
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/news/:id" element={<NewsPage />} />
      </Routes>
    </Router>
  </ThemeProvider>
  );
};

export default App;
