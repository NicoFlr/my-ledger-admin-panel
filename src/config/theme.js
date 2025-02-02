import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2DBA78',
      light: '#208858',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#3299FF',
      contrastText: '#ffffff',
    },
    error: {
      main: '#E22D2D',
      light: '#C81E1E',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#FACA15',
      light: '#E3A008',
      contrastText: '#ffffff',
    },
    success: {
      main: '#2DBA78',
      light: '#208858',
      contrastText: '#ffffff',
    },
    info: {
      main: '#009DFE',
      light: '#006AAB',
      contrastText: '#ffffff',
    },
    text: {
      primary: '#2D3748',
      contrastText: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Arial", "Roboto", "Helvetica", sans-serif',
    h1: {
      fontSize: '2.25em',
      fontWeight: 400,
      lineHeight: '3em',
    },
    h2: {
      fontSize: '1.5em',
      fontWeight: 400,
      lineHeight: '3em',
    },
    h3: {
      fontSize: '1.25em',
      fontWeight: 400,
      lineHeight: '2em',
    },
    h4: {
      fontSize: '1em',
      fontWeight: 400,
      lineHeight: '1.5em',
    },
    h5: {
      fontSize: '0.875em',
      fontWeight: 400,
      lineHeight: '1.25em',
    },
    body: {
      fontSize: '1em',
      fontWeight: 400,
      lineHeight: '1.5em',
    },
    paragraph: {
      fontSize: '0.875em',
      fontWeight: 400,
      lineHeight: '1.5em',
      fontFamily: '"Inter"',
    },
    label: {
      fontSize: '0.6875em',
      fontWeight: 400,
      lineHeight: '1em',
    },
  },
});

export default theme;
