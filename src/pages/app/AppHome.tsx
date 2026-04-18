import { Navigate } from 'react-router-dom';
import { useAcademies } from '../../hooks/useAcademies';
import { isOwnerRole } from '../../lib/academies';
import { LoadingScreen } from '../../components/LoadingScreen';
import { ErrorMessage } from '../../components/ErrorMessage';
import AcademyPicker from './AcademyPicker';
import LockScreen from './LockScreen';

/**
 * Post-login landing. Resolves the user's membership profile and decides:
 *   - Multiple owner academies → AcademyPicker
 *   - Single owner academy → /a/:id/overview
 *   - No owner academies → LockScreen (coach / athlete / no memberships)
 */
export default function AppHome() {
  const { academies, isLoading, error } = useAcademies();

  if (isLoading) return <LoadingScreen />;
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <ErrorMessage message={error} />
        </div>
      </div>
    );
  }

  const ownedAcademies = academies.filter((a) => isOwnerRole(a.role));

  if (ownedAcademies.length === 0) {
    return <LockScreen hasAnyMembership={academies.length > 0} />;
  }

  if (ownedAcademies.length === 1) {
    return <Navigate to={`/app/a/${ownedAcademies[0].id}/overview`} replace />;
  }

  return <AcademyPicker academies={ownedAcademies} />;
}
