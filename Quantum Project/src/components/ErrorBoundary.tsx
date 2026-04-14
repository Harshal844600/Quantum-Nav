import React, { type ReactNode } from 'react';
import { Box, Alert, Button, Typography } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import HomeIcon from '@mui/icons-material/Home';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Omit<ErrorBoundaryState, 'errorInfo'> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Always log errors to console in production for debugging
    console.error('Error caught by boundary:', error);
    if (import.meta.env.DEV) {
      console.error('Component stack:', errorInfo.componentStack);
    }
    
    this.setState({ errorInfo });
    
    // Optional: Send error report to monitoring service
    if (import.meta.env.PROD) {
      this.reportErrorToService(error, errorInfo);
    }
  }

  private reportErrorToService = (error: Error, errorInfo: React.ErrorInfo) => {
    // This is a placeholder for error reporting
    // In production, send this to an error tracking service like Sentry
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };
    
    // Example: Send to error tracking service
    // fetch('/api/errors', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(errorReport),
    // }).catch(() => console.error('Failed to report error'));
    
    if (import.meta.env.DEV) {
      console.log('Error report would be sent:', errorReport);
    }
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleHomeNavigation = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            p: 3,
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'background.default',
          }}
        >
          <Box sx={{ maxWidth: 600 }}>
            <Alert severity="error" sx={{ mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                Oops! Something went wrong
              </Typography>
              <Typography variant="body2" color="inherit" sx={{ mb: 2, lineHeight: 1.6 }}>
                We encountered an unexpected error. Please try one of the actions below to recover.
              </Typography>
              {import.meta.env.DEV && this.state.error && (
                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    bgcolor: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: 1,
                    fontFamily: 'monospace',
                    fontSize: '0.75rem',
                    maxHeight: 200,
                    overflow: 'auto',
                  }}
                >
                  <Typography component="pre" sx={{ m: 0, color: 'inherit', fontSize: 'inherit' }}>
                    {this.state.error.message}
                    {this.state.errorInfo && `\n\n${this.state.errorInfo.componentStack}`}
                  </Typography>
                </Box>
              )}
            </Alert>
            
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, mt: 3 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<RefreshIcon />}
                onClick={this.handleReset}
                fullWidth
              >
                Try Again
              </Button>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<HomeIcon />}
                onClick={this.handleHomeNavigation}
                fullWidth
              >
                Go Home
              </Button>
            </Box>
            
            <Typography variant="caption" sx={{ mt: 3, display: 'block', color: 'text.secondary', textAlign: 'center' }}>
              If the problem persists, please refresh the page or clear your browser cache.
            </Typography>
          </Box>
        </Box>
      );
    }

    return this.props.children;
  }
}
