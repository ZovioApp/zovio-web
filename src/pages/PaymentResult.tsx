import { useSearchParams } from 'react-router-dom';

export default function PaymentResult() {
  const [params] = useSearchParams();
  const isSuccess = params.get('status') === 'success';

  const icon = isSuccess ? '\u{2705}' : '\u{274C}';
  const title = isSuccess ? 'Payment Successful!' : 'Payment Cancelled';
  const message = isSuccess
    ? 'Your payment has been processed. You can close this page and return to the Zovio app.'
    : 'Your payment was not completed. You can close this page and try again in the app.';

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-10">
      <div className="max-w-[400px] w-full text-center">
        <div
          className={`text-6xl mb-4 ${isSuccess ? '' : 'text-[var(--color-error)]'}`}
          aria-hidden
        >
          {icon}
        </div>
        <h1 className="text-2xl font-bold mb-3">{title}</h1>
        <p className="text-[var(--color-text-secondary)] text-[15px] leading-relaxed mb-7">
          {message}
        </p>
        <button
          type="button"
          onClick={() => window.close()}
          className="rounded-[10px] bg-[var(--color-primary)] text-[var(--color-bg)] px-9 py-3.5 text-[15px] font-semibold hover:opacity-90"
        >
          Close
        </button>
      </div>
    </div>
  );
}
