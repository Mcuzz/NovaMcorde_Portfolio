import type {
  ContactLink,
  NavigationSection,
  Project,
  SkillGroup,
  WaveTextLine,
} from '../types/portfolio'
import portraitFace from '../assets/portrait-face.png'
import projectA from '../assets/projects/project-a.png'
import projectB from '../assets/projects/project-b.png'
import projectC from '../assets/projects/project-c.png'
import projectD from '../assets/projects/project-d.png'
import projectE from '../assets/projects/project-e.png'
import projectF from '../assets/projects/project-f.png'
import projectG from '../assets/projects/project-g.png'
import projectI from '../assets/projects/project-i.jpeg'
import p1gift from '../assets/projects/project-a-3-gift.mp4'
import p2gift from '../assets/projects/project-a-4-gift.mp4'
import p3gift from '../assets/projects/project-a-5-gift.mp4'

import LinkedinIcon from '../assets/icons/Contact/linkedin.svg?react'
import GithubIcon from '../assets/icons/Contact/github-brands-solid-full.svg?react'
import MailIcon from '../assets/icons/Contact/mail.svg?react'
import PhoneIcon from '../assets/icons/Contact/phone.svg?react'


export const contactLinks: ContactLink[] = [
  {
    id: 'linkedin',
    icon: LinkedinIcon,
    label: 'linkedin.com/in/natalia',
    href: 'https://www.linkedin.com/in/natalia-urias-velasquez-b86675342/',
  },
  {
    id: 'github',
    icon: GithubIcon,
    label: 'github.com/natalia',
    href: 'https://github.com/Mcuzz',
  },
  {
    id: 'email',
    icon: MailIcon,
    label: 'natvyl4@email.com',
    href: 'mailto:natvyl4@email.com',
  },
  {
    id: 'phone',
    icon: PhoneIcon,
    label: '+52 632 11 32191',
    href: 'tel:+526321132191',
  },
]

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



export const projects: Project[] = [
  {
     title: 'Black Hole Simulator',
    description:
      'Simulador interactivo en navegador para visualizar efectos relativistas cerca de un agujero negro de Schwarzschild. El proyecto combina una escena 3D inmersiva, un modelo fisico simplificado pero consistente y una capa educativa que explica en tiempo real conceptos como dilatacion temporal, corrimiento gravitacional al rojo, lente gravitacional, disco de acrecion y spaghettification visual.',
    stack: ['React 19', 'TypeScript', 'Vite', 'ESLint', 'Three.js', '@react-three/fiber', '@react-three/drei'],
    href: 'https://black-hole-simulator-lovat.vercel.app/',
    status: 'live',
    image: projectA,
    images: [projectA],
    gifs: [
      { src: p1gift, caption: 'Escena 3D interactiva con un agujero negro en el centro y dos naves espaciales con el rol de "Observadores" y victimas de acontesimientos relativistas.' },
      { src: p2gift, caption: 'Panel lateral con control de distancia de nave-agujero y visualizacion/explicacion de efectos de redshift, lente gravitacional, radiacion de hawking, disco de acresion y esfera de fotones en tiempo real.' },
      { src: p3gift, caption: 'Vistas interactivas desde dentro de las naves espaciales.' },
    ],
  },
  {
    title: 'Weather app',
    description:
      'Interfaz climática con lectura de API, estados visuales y microinteracciones limpias.',
    stack: ['React', 'OpenWeather API'],
    href: '#',
    status: 'live',
    image: projectB,
    images: [projectB, projectB, projectB],
  },
  {
    title: 'To-do Kanban',
    description:
      'Gestor de tareas con drag and drop, persistencia local y estructura modular.',
    stack: ['JavaScript', 'LocalStorage'],
    href: '#',
    status: 'live',
    image: projectC,
    images: [projectC, projectC, projectC],
  },
  {
    title: 'Face-nav portfolio',
    description:
      'Portafolio con navegación experimental por deformación de rostro y panel de contenido reactivo.',
    stack: ['React', 'TypeScript', 'Canvas API'],
    href: '#',
    status: 'live',
    image: projectD,
    images: [projectD, projectD, projectD],
  },
  {
    title: 'Weather app',
    description:
      'Interfaz climática con lectura de API, estados visuales y microinteracciones limpias.',
    stack: ['React', 'OpenWeather API'],
    href: '#',
    status: 'live',
    image: projectE,
    images: [projectE, projectE, projectE],
  },
  {
    title: 'To-do Kanban',
    description:
      'Gestor de tareas con drag and drop, persistencia local y estructura modular.',
    stack: ['JavaScript', 'LocalStorage'],
    href: '#',
    status: 'live',
    image: projectF,
    images: [projectF, projectF, projectF],
  },
  {
    title: 'Face-nav portfolio',
    description:
      'Portafolio con navegación experimental por deformación de rostro y panel de contenido reactivo.',
    stack: ['React', 'TypeScript', 'Canvas API'],
    href: '#',
    status: 'live',
    image: projectG,
    images: [projectG, projectG, projectG],
  },
  {
    title: 'Weather app',
    description:
      'Interfaz climática con lectura de API, estados visuales y microinteracciones limpias.',
    stack: ['React', 'OpenWeather API'],
    href: '#',
    status: 'live',
    image: projectI,
    images: [projectI, projectI, projectI],
  },
  {
    title: 'To-do Kanban',
    description:
      'Gestor de tareas con drag and drop, persistencia local y estructura modular.',
    stack: ['JavaScript', 'LocalStorage'],
    href: '#',
    status: 'live',
    image: projectI,
    images: [projectI, projectI, projectI],
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
