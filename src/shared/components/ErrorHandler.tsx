import React, { ReactNode } from 'react';
import ErrorBoundary from './ErrorBoundary';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import { useLocalization } from '../../hooks/useLocalization';

interface ErrorHandlerProps {
  children: ReactNode;
  fallback?: ReactNode;
  showHomeButton?: boolean;
  showBackButton?: boolean;
  onBack?: () => void;
  errorTitle?: string;
  errorMessage?: string;
  context?: string;
}

/**
 * Composant qui combine ErrorBoundary et useErrorHandler
 * @param props Props du composant
 * @returns Composant ErrorHandler
 */
export default function ErrorHandler({
  children,
  fallback,
  showHomeButton,
  showBackButton,
  onBack,
  errorTitle,
  errorMessage,
  context = 'composant'
}: ErrorHandlerProps) {
  const { handleError } = useErrorHandler();
  const { t } = useLocalization();

  const handleComponentError = (error: Error, errorInfo: React.ErrorInfo) => {
    handleError(error, t('errors.errorInContext', { context }));
  };

  return (
    <ErrorBoundary
      fallback={fallback}
      showHomeButton={showHomeButton}
      showBackButton={showBackButton}
      onBack={onBack}
      errorTitle={errorTitle || t('errors.errorTitle')}
      errorMessage={errorMessage || t('errors.errorMessage')}
      onError={handleComponentError}
    >
      {children}
    </ErrorBoundary>
  );
}
