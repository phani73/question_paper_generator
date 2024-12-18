import * as FaIcons from 'react-icons/fa'; // For FontAwesome icons

export const SidebarData = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: <FaIcons.FaHome />,
    cName: 'nav-text',
  },
  {
    title: 'Create Paper',
    path: '/create-paper',
    icon: <FaIcons.FaFileAlt />,
    cName: 'nav-text',
  },
  {
    title: 'Random Generator',
    path: '/random-generate',
    icon: <FaIcons.FaBook />,
    cName: 'nav-text',
  },
 
  // Add more items as necessary
];
