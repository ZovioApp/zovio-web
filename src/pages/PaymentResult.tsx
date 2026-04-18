import { useSearchParams } from 'react-router-dom';
import { Button } from '../components/Button';

export default function PaymentResult() {
  const [params] = useSearchParams();
  const isSuccess = params.get('status') === 'success';

  const title = isSuccess ? 'Payment successful' : 'Payment cancelled';
  const message = isSuccess
    ? 'Your payment went through. You can close this page and return to the Zovio app.'
    : 'Your payment was not completed. You can close this page and try again in the app.';

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="max-w-[400px] w-full">
        <div className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-xl shadow-[var(--shadow-sm)] p-8 text-center">
          <div
            className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-5 ${
              isSuccess
                ? 'bg-[var(--color-success-subtle-bg)] border border-[var(--color-success-subtle-border)] text-[var(--color-success)]'
                : 'bg-[var(--color-error-subtle-bg)] border border-[var(--color-error-subtle-border)] text-[var(--color-error)]'
            }`}
            aria-hidden
          >
            {isSuccess ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M5 10.5L8.5 14L15 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M6 6L14 14M14 6L6 14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>

          <h1 className="text-xl font-semibold text-[var(--color-text)] mb-2">
            {title}
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-6">
            {message}
          </p>

          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={() => window.close()}
          >
            Close window
          </Button>
        </div>
      </div>
    </div>
  );
}
