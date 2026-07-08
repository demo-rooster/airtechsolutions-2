const router = [
  {
    name: 'Home',
    path: '/',
    navigation: false,
    mobile: true
  },
  {
    name: 'About',
    path: '/about',
    navigation: true
  },
  {
    name: 'Services',
    path: '/services',
    navigation: true,
    children: [
      {
        name: 'Window Cleaning',
        path: '/commercial-window-cleaning-boston-west-newton-ma'
      },
      {
        name: 'Office Exterior Cleaning',
        path: '/commercial-office-exterior-cleaning-boston-west-newton-ma'
      },
      {
        name: 'Professional Exterior Cleaning',
        path: '/professional-commercial-exterior-cleaning-boston-ma'
      },
      {
        name: 'Exterior Soft Washing',
        path: '/commercial-soft-washing-boston-west-newton-ma'
      },
      {
        name: 'Dryer Vent Cleaning',
        path: '/commercial-dryer-vent-cleaning-boston-west-newton-ma'
      },
      {
        name: 'Bathroom Exhaust Cleaning',
        path: '/commercial-bathroom-exhaust-cleaning-boston-west-newton-ma'
      },
      {
        name: 'Bathroom Exhaust Repair',
        path: '/commercial-bathroom-exhaust-repair-boston-west-newton-ma'
      },
      {
        name: 'Gutter Cleaning',
        path: '/commercial-gutter-cleaning-boston-west-newton-ma'
      },
      {
        name: 'HVAC Cleaning',
        path: '/commercial-hvac-cleaning-boston-west-newton-ma'
      },
      {
        name: 'Air Quality Testing',
        path: '/commercial-air-quality-testing-boston-west-newton-ma'
      },
      {
        name: 'Caulking Services',
        path: '/commercial-caulking-services-boston-west-newton-ma'
      },
      {
        name: 'Sealing Services',
        path: '/commercial-sealing-services-boston-west-newton-ma'
      }
    ]
  },
  {
    name: 'Blog',
    path: '/blog',
    navigation: false,
    footer: true
  },
  {
    name: 'Service Guides',
    path: '/service-guides',
    navigation: false,
    footer: true
  },
  {
    name: 'Contact',
    path: '/contact',
    navigation: true
  },
  {
    name: 'FAQ',
    path: '/faq',
    navigation: true
  }
]

export default router
