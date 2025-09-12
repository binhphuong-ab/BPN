# BlogPost Field Migration: excerpt → summary

## Overview
The blog post model has been updated to use `summary` instead of `excerpt` for better consistency with the user interface.

## Changes Made

### 1. Model Updates
- **File:** `src/models/blogpost.ts`
- Changed `excerpt: string` to `summary: string` in BlogPost interface
- Renamed `extractExcerpt()` function to `extractSummary()`
- Updated helper functions to use `summary`

### 2. Service Layer Updates
- **File:** `src/lib/blog-service.ts`
- Updated `createPost()` to use `summary` field
- Updated `updatePost()` to handle `summary` field
- Import changed from `extractExcerpt` to `extractSummary`

### 3. Component Updates
- **File:** `src/components/BlogCard.tsx`
  - Changed `post.excerpt` to `post.summary`
  - Renamed prop from `showExcerpt` to `showSummary`
- **File:** `src/components/PostEditor.tsx`
  - Updated form submission to use `summary` field
  - Updated data loading to map to `summary`
- **File:** `src/components/admin/PostsTable.tsx`
  - Changed display from `post.excerpt` to `post.summary`

### 4. SEO Metadata Updates
- **File:** `src/app/blog/[slug]/page.tsx`
- Updated OpenGraph and Twitter card metadata to use `post.summary`

## Database Migration

### For Existing Data
If you have existing blog posts in your database with `excerpt` fields, you may want to run a migration:

```javascript
// MongoDB migration script
db.posts.updateMany(
  { excerpt: { $exists: true } },
  { $rename: { "excerpt": "summary" } }
);
```

### For New Posts
All new posts created through the admin interface will automatically use the `summary` field.

## API Compatibility

### Request Format
When creating/updating posts via API, use `summary` instead of `excerpt`:

```json
{
  "title": "My Post",
  "content": "Post content...",
  "summary": "This is the post summary that will appear in previews",
  "author": "Author Name"
}
```

### Response Format
API responses now include `summary` field instead of `excerpt`:

```json
{
  "_id": "...",
  "title": "My Post",
  "summary": "Post summary for previews",
  "content": "Full post content..."
}
```

## User Interface

The PostEditor now has a dedicated "Summary" field that:
- Is required for all posts
- Has a 300 character limit
- Provides real-time character counting
- Is used for blog previews, social media shares, and SEO descriptions

## Benefits

1. **Consistency**: UI and backend now use the same terminology
2. **Clarity**: "Summary" is more user-friendly than "excerpt"
3. **User Control**: Authors can write custom summaries instead of auto-generated excerpts
4. **SEO**: Better control over meta descriptions and social media previews
