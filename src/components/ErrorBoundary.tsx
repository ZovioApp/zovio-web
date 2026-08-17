import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Last-resort catch for render errors. Without this, any throw during
 * render (including config errors at import time in lazy chunks) leaves
 * the user staring at a blank white page with no way forward.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error('Unhandled render error', error);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="min-h-screen flex items-center justify-center px-6 bg-[var(--color-bg)]">
        <div className="max-w-[400px] w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg shadow-[var(--shadow-sm)] p-6 text-center">
          <p className="wordmark text-lg">Zovio</p>
          <h1 className="text-base font-semibold text-[var(--color-text)] mt-4">
            Something went wrong
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-2">
            An unexpected error stopped the page from loading. Reloading
            usually fixes it.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 inline-flex items-center justify-center rounded-md font-medium transition-colors text-sm px-4 py-2 bg-[var(--color-primary)] text-[var(--color-primary-contrast)] hover:bg-[var(--color-primary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
          >
            Reload page
          </button>
        </div>
      </div>
    );
  }
}
