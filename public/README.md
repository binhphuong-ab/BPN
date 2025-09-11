# Public Assets Directory

This directory contains static assets that are served directly by Next.js. All files in this directory are publicly accessible via URL paths.

## Directory Structure

```
public/
├── images/
│   ├── blog/          # Blog post images and graphics
│   ├── gallery/       # Portfolio or gallery images
│   └── thumbnails/    # Image thumbnails and previews
├── documents/         # PDF files, documents, and downloadable content
├── icons/            # Favicons, app icons, and small graphics
└── uploads/          # User-uploaded content or temporary files
```

## How to Use Assets in Your Blog

### Images in Markdown Posts

```markdown
# Relative paths from public directory
![Alt text](/images/blog/my-image.jpg)
![Gallery image](/images/gallery/portfolio-item.png)

# With custom sizing
<img src="/images/blog/diagram.png" alt="Diagram" width="500" height="300" />
```

### Documents and PDFs

```markdown
# Link to downloadable PDF
[Download my resume](/documents/resume.pdf)
[View project documentation](/documents/project-guide.pdf)
```

### In React Components

```tsx
import Image from 'next/image';

// Optimized images with Next.js Image component
<Image 
  src="/images/blog/hero-image.jpg" 
  alt="Hero image"
  width={800}
  height={400}
  priority
/>

// Regular img tag
<img src="/icons/logo.svg" alt="Logo" />
```

## Best Practices

### File Naming
- Use lowercase with hyphens: `my-blog-post-image.jpg`
- Be descriptive: `react-hooks-diagram.png`
- Include dates for time-sensitive content: `2024-conference-photo.jpg`

### Image Optimization
- Use WebP format when possible for better compression
- Optimize images before uploading (recommended max width: 1200px for blog images)
- Create thumbnails for large images
- Use appropriate file formats:
  - `.jpg/.jpeg` for photos
  - `.png` for graphics with transparency
  - `.svg` for icons and simple graphics
  - `.webp` for modern browsers (best compression)

### File Organization
- **Blog images**: Place in `/images/blog/` and organize by post or topic
- **Gallery/Portfolio**: Use `/images/gallery/` for showcase content
- **Documents**: Place PDFs and downloadable files in `/documents/`
- **Icons**: Small graphics and favicons go in `/icons/`
- **Uploads**: Temporary or user-generated content in `/uploads/`

## URL Access

All files in the public directory are accessible via direct URLs:
- `/images/blog/my-image.jpg` → `https://yoursite.com/images/blog/my-image.jpg`
- `/documents/guide.pdf` → `https://yoursite.com/documents/guide.pdf`
- `/icons/favicon.ico` → `https://yoursite.com/icons/favicon.ico`

## Security Note

⚠️ **Important**: All files in the public directory are publicly accessible. Do not place sensitive information, private documents, or files with personal data in this directory.
