/** Logistics videos — hero is self-hosted for reliable playback */
export const LOGISTICS_VIDEOS = {
  hero: '/videos/hero.mp4',
  heroPoster:
    'https://images.unsplash.com/photo-1494412574642-9f4cbab0d111?w=1920&q=80&auto=format',
  featured: '/videos/hero.mp4',
  featuredPoster:
    'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1920&q=80&auto=format',
} as const;

export const LOGISTICS_SHOWCASE = [
  {
    id: 'ocean-freight',
    title: 'Ocean Freight Operations',
    description: 'Container vessels connecting major global trade routes with end-to-end visibility.',
    src: '/videos/hero.mp4',
    poster:
      'https://images.unsplash.com/photo-1494412574642-9f4cbab0d111?w=800&q=80&auto=format',
  },  {
    id: 'warehousing',
    title: 'Smart Warehousing',
    description: 'Automated storage, inventory management, and fulfillment at scale.',
    src: 'https://videos.pexels.com/video-files/4486575/4486575-hd_1920_1080_30fps.mp4',
    poster:
      'https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80&auto=format',
  },
  {
    id: 'road-freight',
    title: 'Road Freight & Last Mile',
    description: 'Fleet operations and last-mile delivery across urban and regional networks.',
    src: 'https://videos.pexels.com/video-files/856973/856973-hd_1920_1080_25fps.mp4',
    poster:
      'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80&auto=format',
  },
  {
    id: 'port-operations',
    title: 'Port & Terminal Operations',
    description: 'Container handling, customs clearance, and intermodal transfers at major ports.',
    src: 'https://videos.pexels.com/video-files/3044249/3044249-hd_1920_1080_30fps.mp4',
    poster:
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80&auto=format',
  },
] as const;
