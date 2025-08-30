// Mock data for blog posts
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  author: {
    name: string;
    avatar?: string;
  };
  publishedAt: string;
  readTime: string;
  tags: string[];
  likes: number;
  comments: number;
  status: 'published' | 'pending' | 'rejected';
  image?: string;
  isLiked?: boolean;
  isBookmarked?: boolean;
}

export const mockBlogs: BlogPost[] = [
  {
    id: '1',
    title: 'Building Scalable React Applications with TypeScript',
    excerpt: 'Learn how to structure large React applications using TypeScript, best practices for component architecture, and performance optimization techniques.',
    author: {
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=400&h=400&fit=crop&crop=face'
    },
    publishedAt: '2 days ago',
    readTime: '8 min',
    tags: ['React', 'TypeScript', 'Frontend', 'Architecture'],
    likes: 142,
    comments: 23,
    status: 'published',
    image: '/src/assets/blog-react.jpg',
  },
  {
    id: '2',
    title: 'Mastering Node.js: From Beginner to Production',
    excerpt: 'A comprehensive guide to building robust backend applications with Node.js, covering Express.js, middleware, authentication, and deployment strategies.',
    author: {
      name: 'Alex Johnson',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'
    },
    publishedAt: '4 days ago',
    readTime: '12 min',
    tags: ['Node.js', 'Backend', 'Express', 'API'],
    likes: 89,
    comments: 15,
    status: 'published',
    image: '/src/assets/blog-nodejs.jpg',
  },
  {
    id: '3',
    title: 'MongoDB Schema Design Patterns for Modern Applications',
    excerpt: 'Explore advanced MongoDB schema design patterns, indexing strategies, and aggregation pipelines to build efficient database solutions.',
    author: {
      name: 'Maria Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face'
    },
    publishedAt: '1 week ago',
    readTime: '10 min',
    tags: ['MongoDB', 'Database', 'NoSQL', 'Design Patterns'],
    likes: 76,
    comments: 12,
    status: 'published',
    image: '/src/assets/blog-mongodb.jpg',
  },
  {
    id: '4',
    title: 'The Future of Web Development: Trends to Watch in 2024',
    excerpt: 'Discover the latest trends shaping web development, from WebAssembly and edge computing to new JavaScript frameworks and tools.',
    author: {
      name: 'David Kumar',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face'
    },
    publishedAt: '3 days ago',
    readTime: '6 min',
    tags: ['Trends', 'Web Development', 'Future', 'Technology'],
    likes: 203,
    comments: 34,
    status: 'published',
  },
  {
    id: '5',
    title: 'Implementing JWT Authentication in Full-Stack Applications',
    excerpt: 'Step-by-step guide to implementing secure JWT-based authentication in React and Node.js applications with best security practices.',
    author: {
      name: 'Emily Zhang',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face'
    },
    publishedAt: '5 days ago',
    readTime: '15 min',
    tags: ['Authentication', 'JWT', 'Security', 'Full-Stack'],
    likes: 167,
    comments: 28,
    status: 'published',
  },
  {
    id: '6',
    title: 'Microservices Architecture: Lessons from Production',
    excerpt: 'Real-world insights on implementing microservices architecture, common pitfalls to avoid, and strategies for successful deployment.',
    author: {
      name: 'Robert Taylor',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face'
    },
    publishedAt: '1 week ago',
    readTime: '11 min',
    tags: ['Microservices', 'Architecture', 'DevOps', 'Scalability'],
    likes: 134,
    comments: 19,
    status: 'published',
  },
];

export const pendingBlogs: BlogPost[] = [
  {
    id: 'p1',
    title: 'GraphQL vs REST: Making the Right Choice',
    excerpt: 'An in-depth comparison of GraphQL and REST APIs, helping you choose the right approach for your next project.',
    author: {
      name: 'John Smith',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&h=400&fit=crop&crop=face'
    },
    publishedAt: 'Submitted 2 hours ago',
    readTime: '9 min',
    tags: ['GraphQL', 'REST', 'API', 'Comparison'],
    likes: 0,
    comments: 0,
    status: 'pending',
  },
  {
    id: 'p2',
    title: 'Docker Best Practices for Node.js Applications',
    excerpt: 'Learn how to containerize your Node.js applications efficiently using Docker with production-ready practices.',
    author: {
      name: 'Lisa Wang',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=face'
    },
    publishedAt: 'Submitted 1 day ago',
    readTime: '7 min',
    tags: ['Docker', 'Node.js', 'DevOps', 'Containerization'],
    likes: 0,
    comments: 0,
    status: 'pending',
  },
];