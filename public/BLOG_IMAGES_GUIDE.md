# Blog Images Guide

## Featured Images for Blog Posts

Your blog now supports featured images! These are displayed in blog cards and can be used as hero images for your posts.

### How to Add Featured Images

1. **Upload your image** to the appropriate directory:
   - Place blog images in: `/public/images/blog/`
   - Use descriptive filenames: `react-tutorial-hero.jpg`, `javascript-tips-cover.png`

2. **Add the image path** in the Post Editor:
   - In the "Featured Image" field, enter: `/images/blog/your-image.jpg`
   - The preview will show immediately if the path is correct
   - Leave blank if you don't want a featured image

### Image Path Examples

```
✅ Correct paths:
/images/blog/react-hooks-tutorial.jpg
/images/blog/nextjs-deployment-guide.png
/images/gallery/portfolio-project.jpg

❌ Incorrect paths:
images/blog/my-image.jpg    (missing leading slash)
../public/images/blog/image.jpg    (don't use relative paths)
https://external-site.com/image.jpg    (external URLs not recommended)
```

### Where Featured Images Appear

1. **Blog Cards**: Featured images show as the main visual on blog listing pages
2. **Admin Dashboard**: Preview in the post editor form
3. **SEO/Social**: Can be used for Open Graph images (future feature)

### Image Requirements

- **Format**: JPG, PNG, WebP, or SVG
- **Size**: Recommended 1200x600px for best results
- **File Size**: Keep under 500KB for fast loading
- **Aspect Ratio**: 2:1 ratio works best for blog cards

### Adding Images in Post Content

Besides featured images, you can add images anywhere in your post content using Markdown:

```markdown
# In your post content
![Image description](/images/blog/diagram.png)

# With custom sizing
<img src="/images/blog/screenshot.png" alt="Screenshot" width="600" />

# Centered images
<div align="center">
  <img src="/images/blog/chart.png" alt="Data chart" width="800" />
  <p><em>Figure 1: Performance metrics over time</em></p>
</div>
```

### Best Practices

1. **Optimize before uploading**:
   - Compress images to reduce file size
   - Use WebP format when possible for better compression
   - Resize to appropriate dimensions

2. **Use descriptive filenames**:
   ```
   ✅ Good: react-component-lifecycle-diagram.png
   ✅ Good: 2024-web-performance-tips.jpg
   ❌ Bad: IMG_001.jpg
   ❌ Bad: Screenshot 2024-01-01.png
   ```

3. **Alt text matters**:
   - Always include descriptive alt text
   - Helps with accessibility and SEO
   - Be specific: "React component lifecycle diagram" not "diagram"

4. **Organize by topic or date**:
   ```
   public/images/blog/
   ├── 2024/
   │   ├── react-tutorial-hero.jpg
   │   └── javascript-tips-cover.png
   ├── tutorials/
   │   └── step-by-step-guide.png
   └── general/
       └── welcome-banner.jpg
   ```

### Image Preview in Editor

The Post Editor includes a live preview feature:
- Type an image path in the "Featured Image" field
- Preview appears below the input field
- If the image doesn't load, check the file path
- Preview uses a 128px height for quick viewing

### Troubleshooting

**Image not showing in preview?**
- Check the file path starts with `/`
- Verify the file exists in the public directory
- Make sure the filename matches exactly (case-sensitive)

**Image too large/small in blog cards?**
- Blog cards use a fixed 192px height (h-48)
- Images are cropped using `object-cover`
- Use 2:1 aspect ratio (e.g., 1200x600px) for best fit

**Build warnings about images?**
- The editor preview uses `<img>` for simplicity
- Blog cards use optimized `<Image />` component
- This is intentional for better performance

### Examples

Here are some real examples of how to use images effectively:

1. **Tutorial post with featured image**:
   - Featured image: `/images/blog/react-hooks-tutorial-hero.jpg`
   - Content images: Step-by-step screenshots

2. **Technical post with diagrams**:
   - Featured image: `/images/blog/architecture-overview.png`
   - Content: Detailed technical diagrams

3. **Personal post with photos**:
   - Featured image: `/images/blog/conference-2024.jpg`
   - Content: Event photos and highlights

Remember: Featured images make your blog posts more engaging and professional-looking!
