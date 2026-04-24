import { render, screen } from '@testing-library/react';
import PostCard from '@/components/PostCard';

// Mock next/image and next/link
jest.mock('next/image', () => ({ __esModule: true, default: (props) => <img {...props} /> }));
jest.mock('next/link', () => ({ __esModule: true, default: ({ children, href }) => <a href={href}>{children}</a> }));

const mockPost = {
  id: 1,
  title: 'Test Blog Post',
  slug: 'test-blog-post',
  excerpt: 'This is a test excerpt for the blog post.',
  category: 'technology',
  publishedAt: '2024-01-15T00:00:00.000Z',
  readTime: 3,
  coverImageUrl: null,
  coverImage: null,
};

describe('PostCard', () => {
  it('renders the post title', () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText('Test Blog Post')).toBeInTheDocument();
  });

  it('renders the excerpt', () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText(/test excerpt/i)).toBeInTheDocument();
  });

  it('renders the category badge', () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText('technology')).toBeInTheDocument();
  });

  it('renders a link to the post', () => {
    render(<PostCard post={mockPost} />);
    const links = screen.getAllByRole('link');
    expect(links.some((l) => l.href.includes('test-blog-post'))).toBe(true);
  });

  it('renders read time', () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText(/3 min/i)).toBeInTheDocument();
  });
});
