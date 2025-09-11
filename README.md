# Binh Phuong Nguyen's Personal Blog

A modern, feature-rich personal blog built with Next.js 14, TypeScript, and MongoDB Atlas.

## 🚀 Features

- **Next.js 14** with App Router and TypeScript
- **Markdown Editor** with KaTeX math support using react-md-editor
- **MongoDB Atlas** for data persistence
- **Responsive Design** with Tailwind CSS
- **SEO Optimized** with proper metadata
- **Admin Dashboard** for content management
- **Blog Features**:
  - Create, edit, and delete blog posts
  - Markdown support with syntax highlighting
  - Math expressions with KaTeX
  - Tag system and search functionality
  - View counting and reading time estimation
  - Draft and publish system

## 🛠️ Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Database**: MongoDB Atlas
- **Styling**: Tailwind CSS
- **Markdown Editor**: @uiw/react-md-editor
- **Math Rendering**: KaTeX
- **Date Handling**: date-fns

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- MongoDB Atlas account (connection string provided)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd binhphuongnguyen
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   The `.env.local` file is already configured with:
   ```env
   MONGODB_URI=mongodb+srv://NguyenBinhPhuong:eRkRBvxPo6STMZA6@binhphuongnguyen.1x4ogft.mongodb.net/?retryWrites=true&w=majority&appName=BinhPhuongNguyen
   NEXTAUTH_SECRET=your-secret-here-change-in-production
   NEXTAUTH_URL=http://localhost:3000
   BLOG_TITLE="Binh Phuong Nguyen's Blog"
   BLOG_DESCRIPTION="Personal blog about technology, programming, and insights"
   BLOG_AUTHOR="Binh Phuong Nguyen"
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage

### Admin Panel

1. Go to `/admin` to access the admin dashboard
2. Click "Create New Post" to write a new blog post
3. Use the markdown editor with KaTeX support for math expressions
4. Save as draft or publish immediately

### Writing Posts

The markdown editor supports:

- **Basic Markdown**: headings, bold, italic, links, lists, etc.
- **Code Blocks**: Syntax highlighting for various languages
- **Math Expressions**: 
  - Inline: `$x = y + z$`
  - Block: `$$\\int_0^1 x dx$$`
- **Tags**: Comma-separated for categorization

### Math Examples

Inline math: The quadratic formula is $x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$

Block math:
```
$$
\\begin{align}
\\frac{d}{dx}\\left( \\int_{0}^{x} f(u)\\,du\\right) = f(x)
\\end{align}
$$
```

## 🗂️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard pages
│   ├── blog/              # Blog pages
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── MDEditor.tsx       # Custom markdown editor with KaTeX
│   ├── BlogCard.tsx       # Blog post card component
│   ├── Navigation.tsx     # Site navigation
│   └── Footer.tsx         # Site footer
├── lib/                   # Utilities and services
│   ├── mongodb.ts         # Database connection
│   ├── models.ts          # Data models and types
│   └── blog-service.ts    # Blog operations service
└── globals.css            # Global styles
```

## 🔌 API Endpoints

- `GET /api/posts` - Get all published posts (with pagination, search, filtering)
- `POST /api/posts` - Create a new post
- `GET /api/posts/[id]` - Get post by ID
- `PUT /api/posts/[id]` - Update post
- `DELETE /api/posts/[id]` - Delete post
- `GET /api/posts/slug/[slug]` - Get post by slug (public view)
- `GET /api/tags` - Get all unique tags

## 🎨 Customization

### Styling
- Modify `src/app/globals.css` for global styles
- Update Tailwind configuration in `tailwind.config.ts`

### Blog Configuration
- Update environment variables in `.env.local`
- Modify default values in components and layouts

### Adding Features
- Extend the MongoDB models in `src/lib/models.ts`
- Add new API routes in `src/app/api/`
- Create new components in `src/components/`

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on git push

### Other Platforms
The app is a standard Next.js application and can be deployed to:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 📝 Features to Add

- [ ] User authentication system
- [ ] Comment system
- [ ] Newsletter subscription
- [ ] RSS feed
- [ ] Search with full-text indexing
- [ ] Image upload functionality
- [ ] Social media sharing
- [ ] Analytics integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Binh Phuong Nguyen**
- Blog: [Your Blog URL]
- Email: contact@example.com
- GitHub: [@username](https://github.com/username)

---

Built with ❤️ using Next.js 14, TypeScript, and modern web technologies.