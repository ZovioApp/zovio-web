import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-10">
      <div className="text-center max-w-[400px]">
        <h1 className="brand-gradient text-6xl font-bold mb-4">404</h1>
        <p className="text-[var(--color-text-secondary)] text-lg mb-8">
          We couldn't find that page.
        </p>
        <Link
          to="/"
          className="inline-block rounded-[10px] bg-[var(--color-primary)] text-[var(--color-bg)] px-6 py-3 text-[15px] font-semibold hover:opacity-90"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
