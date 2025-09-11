# How to Use Public Assets in Your Blog

## In Markdown Blog Posts

### Adding Images

```markdown
# Simple image
![My awesome diagram](/images/blog/awesome-diagram.png)

# Image with custom HTML for sizing
<img src="/images/blog/screenshot.png" alt="Application screenshot" width="600" height="400" />

# Centered image with caption
<div align="center">
  <img src="/images/blog/architecture.png" alt="System architecture" width="800" />
  <p><em>Figure 1: System Architecture Overview</em></p>
</div>
```

### Adding Documents

```markdown
# Download links
[📄 Download my resume](/documents/john-doe-resume.pdf)
[📊 View the technical report](/documents/analysis-report.pdf)
[🔗 API Documentation](/documents/api-guide.pdf)

# Embedded PDF (if supported by browser)
<embed src="/documents/presentation.pdf" type="application/pdf" width="100%" height="600px" />
```

### Adding Icons

```markdown
# Inline icons
![GitHub](/icons/github-icon.svg) Check out my [GitHub profile](https://github.com/username)
![LinkedIn](/icons/linkedin-icon.svg) Connect with me on [LinkedIn](https://linkedin.com/in/username)
```

## In React Components

### Using Next.js Image Component (Recommended)

```tsx
import Image from 'next/image';

function BlogPost() {
  return (
    <div>
      {/* Optimized image with Next.js */}
      <Image 
        src="/images/blog/hero-image.jpg" 
        alt="Hero image for the blog post"
        width={800}
        height={400}
        priority // For above-the-fold images
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,..." // Optional blur placeholder
      />
      
      {/* Gallery image */}
      <Image 
        src="/images/gallery/project-showcase.jpg" 
        alt="Project showcase"
        width={600}
        height={400}
        className="rounded-lg shadow-lg"
      />
    </div>
  );
}
```

### Regular HTML Images

```tsx
function Component() {
  return (
    <div>
      {/* Regular img tag */}
      <img 
        src="/images/blog/diagram.png" 
        alt="Technical diagram" 
        className="w-full h-auto"
      />
      
      {/* Icon */}
      <img 
        src="/icons/logo.svg" 
        alt="Company logo" 
        className="w-8 h-8"
      />
    </div>
  );
}
```

### Document Links

```tsx
function Downloads() {
  return (
    <div className="space-y-4">
      <a 
        href="/documents/resume.pdf" 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
      >
        <span>📄</span>
        <span>Download Resume</span>
      </a>
      
      <a 
        href="/documents/portfolio.pdf" 
        download="john-doe-portfolio.pdf"
        className="btn btn-primary"
      >
        Download Portfolio
      </a>
    </div>
  );
}
```

## KaTeX Math with Images

You can combine KaTeX math expressions with images:

```markdown
Here's the formula for calculating the area:

$$A = \pi r^2$$

And here's a visual representation:

![Circle area diagram](/images/blog/circle-area.svg)
```

## Best Practices

### 1. File Naming Convention
```
✅ Good:
- blog-post-hero.jpg
- react-hooks-diagram.png
- 2024-conference-photo.jpg
- user-guide.pdf

❌ Avoid:
- IMG_001.jpg
- Screenshot 2024-01-01 at 10.30.45 AM.png
- Untitled document.pdf
```

### 2. Image Optimization
```bash
# Recommended image sizes
Blog hero images: 1200x600px
Inline blog images: 800x400px
Thumbnails: 300x200px
Icons: 32x32px or SVG
```

### 3. File Organization Example
```
public/
├── images/
│   ├── blog/
│   │   ├── 2024/
│   │   │   ├── react-tutorial-hero.jpg
│   │   │   └── state-management-diagram.png
│   │   └── javascript/
│   │       └── closure-example.png
│   └── gallery/
│       ├── project-1-showcase.jpg
│       └── project-2-preview.png
├── documents/
│   ├── resume-2024.pdf
│   └── technical-reports/
│       └── performance-analysis.pdf
└── icons/
    ├── social/
    │   ├── github.svg
    │   └── linkedin.svg
    └── tech/
        ├── react.svg
        └── nodejs.svg
```

## Testing Your Assets

You can test if your assets are accessible by visiting them directly:
- `http://localhost:3000/images/blog/my-image.jpg`
- `http://localhost:3000/documents/my-document.pdf`
- `http://localhost:3000/favicon.ico`
