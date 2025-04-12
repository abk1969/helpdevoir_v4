import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import TouchFeedback from './TouchFeedback';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Une erreur est survenue
            </h1>
            <p className="text-gray-600 mb-6">
              Nous nous excusons pour la gêne occasionnée.
            </p>
            <TouchFeedback onClick={this.handleReset}>
              <div className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg">
                <RefreshCw className="h-5 w-5 mr-2" />
                Recharger la page
              </div>
            </TouchFeedback>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}