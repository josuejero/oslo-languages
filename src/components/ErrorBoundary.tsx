// src/components/ErrorBoundary.tsx - UPDATED
'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { logger } from '@/lib/logger';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('Error caught by boundary:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });
  }

  private handleReset = () => {
    this.props.onReset?.();
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-[400px] flex items-center justify-center bg-bg-secondary">
          <div className="text-center p-8 bg-bg-tertiary rounded-lg shadow-xl max-w-lg">
            <h2 className="text-2xl font-bold text-text-primary mb-4">
              Something went wrong
            </h2>
            <p className="text-text-secondary mb-6">
              {this.state.error?.message || 'An unexpected error occurred.'}
            </p>
            <div className="space-x-4">
              <button
                onClick={this.handleReset}
                className="bg-accent-primary text-white px-6 py-2 rounded hover:bg-accent-secondary transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="border border-accent-primary text-accent-primary px-6 py-2 rounded hover:bg-bg-secondary transition-colors"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}