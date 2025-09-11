# Language Feature Guide

## Overview

Your blog now supports bilingual content with English and Vietnamese options! This feature allows you to specify the primary language for each blog post and provides visual indicators throughout the application.

## Language Field Details

### BlogPost Model (`src/models/blogpost.ts`)
```typescript
interface BlogPost {
  // ... other fields ...
  language: 'English' | 'Vietnamese'; // Post language
  // ... other fields ...
}
```

### Supported Languages
- **English** 🇺🇸 EN
- **Vietnamese** 🇻🇳 VI

## Using the Language Feature

### 1. In Post Editor
- **Location**: Basic Information section in PostEditor
- **Field Type**: Dropdown select
- **Default**: English
- **Required**: Yes

**How to use:**
1. When creating/editing a post
2. In the "Basic Information" section
3. Select from the "Language" dropdown
4. Choose either "English" or "Vietnamese"
5. Save your post

### 2. Visual Indicators

#### Blog Cards (Blog Listing Page)
```
🇺🇸 EN - Green background for English posts
🇻🇳 VI - Red background for Vietnamese posts
```

#### Individual Blog Posts
```
🇺🇸 English - Green badge in the header
🇻🇳 Vietnamese - Red badge in the header
```

#### Admin Dashboard
```
Language column in the posts table:
🇺🇸 EN - English posts
🇻🇳 VI - Vietnamese posts
```

## Where Language Indicators Appear

### 1. Blog Card Component (`BlogCard.tsx`)
- Displays language badge alongside tags
- Color-coded for quick recognition
- Shows flag emoji + language code

### 2. Individual Post Page (`blog/[slug]/page.tsx`)
- Language badge in post header
- Appears before tags
- Full language name with flag

### 3. Admin Dashboard (`admin/page.tsx`)
- Dedicated "Language" column in posts table
- Compact flag + code format
- Color-coded for easy filtering

### 4. Post Editor (`PostEditor.tsx`)
- Dropdown selection in Basic Information
- Visual feedback on current selection
- Required field validation

## Technical Implementation

### Form Handling
```typescript
// FormData interface includes language
interface FormData {
  // ... other fields ...
  language: 'English' | 'Vietnamese';
  // ... other fields ...
}

// Default to English for new posts
const [formData, setFormData] = useState<FormData>({
  // ... other defaults ...
  language: 'English',
  // ... other defaults ...
});
```

### Database Storage
- Language is stored as a string field
- Constrained to 'English' or 'Vietnamese'
- Required field for all posts
- Backward compatibility: defaults to 'English' for existing posts

### Visual Design
```css
English Posts:
- Background: bg-green-100
- Text: text-green-800
- Icon: 🇺🇸 EN

Vietnamese Posts:
- Background: bg-red-100
- Text: text-red-800
- Icon: 🇻🇳 VI
```

## Usage Examples

### Creating an English Post
1. Go to Admin → Create New Post
2. Fill in basic information
3. Language field defaults to "English"
4. Write content in English
5. Publish

### Creating a Vietnamese Post
1. Go to Admin → Create New Post
2. Fill in basic information
3. Change Language field to "Vietnamese"
4. Write content in Vietnamese
5. Publish

### Editing Language
1. Go to Admin Dashboard
2. Click "Edit" on any post
3. Change the Language dropdown
4. Save changes

## Benefits

### 1. **Content Organization**
- Clear identification of post language
- Easy filtering and management
- Better user experience

### 2. **Visual Clarity**
- Instant recognition of content language
- Consistent color coding
- Professional appearance

### 3. **SEO Benefits**
- Language metadata for search engines
- Better content targeting
- Improved accessibility

### 4. **User Experience**
- Readers know what to expect
- Clear language indicators
- Consistent design patterns

## Future Enhancements

Potential improvements you could add:

1. **Language Filtering**
   - Filter blog posts by language
   - Language-specific URLs
   - Separate RSS feeds

2. **Translation Features**
   - Link related posts in different languages
   - Translation management
   - Language switcher

3. **Localization**
   - Interface translation based on post language
   - Date formatting by locale
   - Number formatting

4. **Analytics**
   - Track views by language
   - Language preference analytics
   - Content performance by language

## Troubleshooting

### Language Not Showing
- Check if post has language field set
- Verify BlogPost interface is properly imported
- Ensure fallback to 'English' for older posts

### Styling Issues
- Verify Tailwind classes are applied correctly
- Check for proper conditional rendering
- Ensure flag emojis are supported

### Form Validation
- Language field is required
- Dropdown should default to 'English'
- TypeScript ensures type safety

The language feature is now fully integrated and ready to help you create bilingual content! 🌐
