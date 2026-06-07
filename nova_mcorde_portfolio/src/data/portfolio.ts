import type {
  ContactLink,
  NavigationSection,
  Project,
  SkillGroup,
  WaveTextLine,
} from '../types/portfolio'
import portraitFace from '../assets/portrait-face.png'

export const profile = {
  name: 'Natalia Yamileth Urias Velasquez',
  role: 'Programador Full Stack Junior',
  location: 'De Hermosillo, Sonora, México. Para cualquier rincón del mundo.',
  portraitSrc: portraitFace,
}

export const navigationSections: NavigationSection[] = [
  { id: 'home', label: 'Home', ariaLabel: 'Ir a inicio' },
  { id: 'projects', label: 'Projects', ariaLabel: 'Ir a proyectos' },
  { id: 'skills', label: 'Skills', ariaLabel: 'Ir a habilidades' },
  { id: 'about', label: 'About me', ariaLabel: 'Ir a sobre mí' },
]

export const roleWaveLines: WaveTextLine[] = [['Pro', 'gra', 'ma', 'dor ', 'Ju', 'nior']]

export const nameWaveLines: WaveTextLine[] = [
  ['Na', 'ta', 'lia ', 'Ya', 'mi', 'leth ', 'U', 'rias ', 'Ve', 'las', 'quez'],
]

export const contactLinks: ContactLink[] = [
  {
    id: 'linkedin',
    icon: 'in',
    label: 'linkedin.com/in/natalia',
    href: 'https://linkedin.com/',
  },
  {
    id: 'github',
    icon: 'gh',
    label: 'github.com/natalia',
    href: 'https://github.com/',
  },
  {
    id: 'email',
    icon: '✉',
    label: 'natalia@email.com',
    href: 'mailto:natalia@email.com',
  },
]

export const projects: Project[] = [
  {
    title: 'Face-nav portfolio',
    description:
      'Portafolio con navegación experimental por deformación de rostro y panel de contenido reactivo.',
    stack: ['React', 'TypeScript', 'Canvas API'],
    href: '#',
    status: 'live',
  },
  {
    title: 'Weather app',
    description:
      'Interfaz climática con lectura de API, estados visuales y microinteracciones limpias.',
    stack: ['React', 'OpenWeather API'],
    href: '#',
    status: 'live',
  },
  {
    title: 'To-do Kanban',
    description:
      'Gestor de tareas con drag and drop, persistencia local y estructura modular.',
    stack: ['JavaScript', 'LocalStorage'],
    href: '#',
    status: 'live',
  },
]

export const skillGroups: SkillGroup[] = [
  {
    title: 'Lenguajes',
    items: [{ name: 'JavaScript' }, { name: 'TypeScript' }, { name: 'HTML / CSS' }],
  },
  {
    title: 'Frameworks & tools',
    items: [
      { name: 'React' },
      { name: 'Git / GitHub' },
      { name: 'Canvas API' },
      { name: 'Figma' },
      { name: 'Node.js' },
      { name: 'CSS animations' },
    ],
  },
  {
    title: 'Aprendiendo',
    items: [
      { name: 'Three.js', learning: true },
      { name: 'WebGL', learning: true },
      { name: 'Arquitectura frontend', learning: true },
    ],
  },
]
