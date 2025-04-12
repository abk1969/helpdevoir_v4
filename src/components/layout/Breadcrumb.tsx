import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useStudentStore } from '../../store/studentStore';

export function Breadcrumb() {
  const location = useLocation();
  const { studentId } = useParams();
  const getStudents = useStudentStore((state) => state.getStudents);
  const student = studentId ? getStudents().find(s => s.id === studentId) : null;

  const pathSegments = location.pathname
    .split('/')
    .filter(segment => segment !== '');

  const getBreadcrumbLabel = (segment: string, index: number) => {
    if (index === 1 && segment === studentId && student) {
      return student.firstName;
    }

    const labels: { [key: string]: string } = {
      students: 'Étudiants',
      dashboard: 'Tableau de bord',
      subjects: 'Matières',
      settings: 'Paramètres',
      subscription: 'Abonnement',
      add: 'Ajouter',
      dyslexia: 'Parcours Dyslexie',
      hearing: 'Parcours Malentendants',
      visual: 'Parcours Malvoyants',
      community: 'Communauté',
      notifications: 'Notifications',
      help: 'Aide'
    };

    return labels[segment] || segment;
  };

  const getSegmentPath = (index: number) => {
    return '/' + pathSegments.slice(0, index + 1).join('/');
  };

  return (
    <nav className="flex items-center space-x-2 text-sm" aria-label="Fil d'Ariane">
      <Link
        to="/"
        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 flex items-center"
      >
        <Home className="h-4 w-4" />
        <span className="sr-only">Accueil</span>
      </Link>

      {pathSegments.map((segment, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <Link
            to={getSegmentPath(index)}
            className={`${
              index === pathSegments.length - 1
                ? 'text-gray-900 dark:text-gray-100 font-medium'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            {getBreadcrumbLabel(segment, index)}
          </Link>
        </React.Fragment>
      ))}
    </nav>
  );
}