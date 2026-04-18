import { Link } from 'react-router-dom';
import { Button } from '../components/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="text-center max-w-[360px]">
        <div className="text-[11px] uppercase tracking-wider font-medium text-[var(--color-text-muted)] mb-2">
          404
        </div>
        <h1 className="text-2xl font-semibold text-[var(--color-text)] mb-2">
          Page not found
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] mb-6">
          We couldn't find that page.
        </p>
        <Link to="/">
          <Button variant="primary" size="md">
            Back to home
          </Button>
        </Link>
      </div>
    </div>
  );
}
