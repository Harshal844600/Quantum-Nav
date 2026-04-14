/* eslint-disable @typescript-eslint/no-explicit-any */
declare module '@mui/material' {
  export const Alert: any;
  export const Box: any;
  export const Button: any;
  export const Typography: any;
}

declare module '@mui/material/styles' {
  export const ThemeProvider: any;
  export const createTheme: any;
  export const styled: any;
  export const useTheme: any;
}

declare module '@mui/material/*' {
  const component: any;
  export default component;
}

declare module '@mui/icons-material/*' {
  const icon: any;
  export default icon;
}
/* eslint-enable @typescript-eslint/no-explicit-any */