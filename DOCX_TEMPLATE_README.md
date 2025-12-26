# DOCX Template Guide for Strapi Publisher Extension

This guide provides an **optimized template** for creating Google Docs documents that will be accurately parsed and published to Strapi using the Chrome extension. Follow these guidelines for best results, especially when working with images and complex formatting.

## Quick Optimization Summary

**For Best Performance:**
- ✅ Keep DOCX file size under 10MB total
- ✅ Compress images to under 2MB each before inserting
- ✅ Use 5-10 images per article (optimal)
- ✅ Place first image early (becomes featured image)
- ✅ Add alt text to all images
- ✅ Use built-in Google Docs styles (Heading 1, Heading 2, Strong, Emphasis)
- ✅ Follow exact structure: Metadata → Title → Content → Disclaimer

**Image Handling:**
- Images can be placed **anywhere** in content (not fixed position)
- First image automatically becomes `featuredImage` in Strapi
- All images stored in `images` array in Strapi
- Images are extracted, uploaded separately, and replaced with placeholders in content

**Text Style Preservation:**
- Headings (H1, H2, H3) are preserved
- Bold, Italic, Underline formatting maintained
- Lists (bullet and numbered) preserved
- Quotes converted to blockquote

## Optimized Document Structure

Your DOCX document should follow this **exact structure** for maximum accuracy and performance:

```
METADATA SECTION (at the top)
↓
MAIN TITLE (as Heading 1)
↓
[OPTIONAL: Featured Image - First image in document]
↓
CONTENT SECTION (Introduction to Disclaimer)
  - Can contain multiple images at any position
↓
DISCLAIMER
```

### Why This Structure?

- **Metadata First**: Ensures reliable extraction before content processing
- **Title Early**: Provides fallback if metadata title is missing
- **Images Anywhere**: Images can be placed anywhere in content (they'll be extracted and uploaded separately)
- **Clear Boundaries**: Introduction/Disclaimer markers ensure clean content extraction

---

## Metadata Section Template

Place all metadata fields at the **very beginning** of your document, one per line. Use this exact format:

```
URL: https://your-website.com/article-url

Meta-Title: Your SEO Meta Title Here (60 characters max recommended)

Meta-Description: Your SEO meta description here. This should be a compelling summary of your article that will appear in search results. Keep it under 160 characters for best results.

Meta-Keywords: keyword1, keyword2, keyword3, keyword4

Image ALT: Descriptive alt text for your featured image

Publish At: 2024-12-25T10:00:00.000Z
```

### Metadata Field Formats

| Field | Format | Example | Required |
|-------|--------|---------|----------|
| **URL** | `URL: [full URL]` | `URL: https://example.com/article` | Optional |
| **Meta-Title** | `Meta-Title: [title]` | `Meta-Title: Financial Lessons from Ramayan` | Optional |
| **Meta-Description** | `Meta-Description: [description]` | `Meta-Description: Learn financial lessons...` | Optional |
| **Meta-Keywords** | `Meta-Keywords: [comma-separated]` | `Meta-Keywords: finance, investment, ramayan` | Optional |
| **Image ALT** | `Image ALT: [alt text]` | `Image ALT: Financial planning illustration` | Optional |
| **Publish At** | `Publish At: [ISO date]` | `Publish At: 2024-12-25T10:00:00.000Z` | Optional |

### Important Notes:
- Use **colon (`:`) followed by a space** after the field name
- Each metadata field should be on its **own line**
- Field names are **case-insensitive** (URL, url, Url all work)
- You can use **hyphens** in field names (Meta-Title or Meta Title both work)
- Leave a **blank line** after the metadata section before your content

---

## Content Section Template

After the metadata section, your document should have:

### 1. Main Title (Heading 1)
```
Dussehra and Financial Freedom: Lessons from Ramayana
```

**Format:** Use **Heading 1** style in Google Docs
- This will be extracted as the article title
- Should be descriptive and SEO-friendly
- Will be used if no "Title" field is found in metadata

### 2. Introduction Section
```
Introduction

Your introduction paragraph here. This is where you set the context for your article and engage your readers.
```

**Format:** 
- Use **Heading 2** or **Bold text** for "Introduction"
- The word "Introduction" must appear exactly as written (case-insensitive)
- This marks the **start** of the content that will be extracted

### 3. Main Content
```
The Cost of Misguided Promises: Avoid Taking Wrong Advice

Your main content paragraphs here. Use regular paragraph formatting.

You can include:
- Bullet points
- Numbered lists
- Bold and italic text
- Links

Dharma above Comfort: Stick to Financial Discipline

More content paragraphs here...
```

**Format:**
- Use **Heading 2** or **Bold text** for section headings
- Use regular paragraphs for body text
- All formatting (bold, italic, lists) will be preserved

### 4. Final Thoughts / Conclusion
```
Final Thoughts

Your conclusion paragraph here. Summarize the key points and provide a call to action.
```

**Format:**
- Use **Heading 2** or **Bold text** for "Final Thoughts"
- This section will be included in the extracted content

### 5. Disclaimer Section
```
Disclaimer

[Disclaimer: The information provided in this article is for educational and informational purposes only...]
```

**Format:**
- Use **Heading 2** or **Bold text** for "Disclaimer"
- The word "Disclaimer" must appear exactly as written (case-insensitive)
- This marks the **end** of the content that will be extracted
- Everything after "Disclaimer" will be removed from the published content

---

## Complete Example Template

Here's a complete example of how your document should look:

```
URL: https://anandrathi.com/financial-lessons-from-dussehra-and-ramayan

Meta-Title: Financial Lessons from Ramayan (Dussehra) - Anand Rathi

Meta-Description: Learn how the folklore of Ramayan can help you achieve your financial and investment goals with Anand Rathi (ARSSBL). Explore the financial lessons from Dussehra.

Meta-Keywords: financial planning, investment, ramayan, dussehra, financial freedom

Image ALT: Financial and Investment Learnings from Ramayan and Dussehra

Publish At: 2024-12-25T10:00:00.000Z


Dussehra and Financial Freedom: Lessons from Ramayana

Introduction

Popularly, Dussehra is celebrated as a victory of good over evil. During this time, the streets are filled with the magical storytelling of the Ram Leela act, followed by Ravan Dehan on the 10th day. And it is widely celebrated in more than seven countries worldwide. But, there's a catch.

With more than 300 versions of the Ramayana, every story has a pungent twist from the popular folklore. Notably, every story shares the same set of lessons and the triumph of Lord Rama over Ravana. Not only personally, but also financially, the Ramayana teaches us a great deal.

In this blog, let us discover the top 14 financial lessons from Ramayana and how they can drive your finances and investments towards the achievement of your goals.

The Cost of Misguided Promises: Avoid Taking Wrong Advice

Destiny was on the cards, and King Dasaratha gave a promise to Queen Kaikeyi. His hasty vow to Kaikeyi changed everything, resulting in the exile of Lord Rama from the palace, along with Lakshmana and Ma Sita.

But there lies a hidden financial lesson for us.

Many investors, like Dasaratha, make impulsive commitments for their investments. They keep falling for hype, fake promises, or half-baked advice, and let their money cry. This aftermath can be costly and impact your finances.

Final Thoughts

Lastly, this guide serves as a condensed version of financial lessons. From Ravana's greed and overconfidence, Lord Rama's resilient army and adherence to Dharma, to the Vanara sena's small contribution, each character has a lot to teach from a financial perspective.

Disclaimer

[Disclaimer: The information provided in this article is for educational and informational purposes only. Any financial figures, calculations, or projections shared are solely intended to illustrate concepts and should not be construed as investment advice. Readers are advised to consult with a certified financial advisor before making any investment decisions.]
```

---

## Best Practices

### 1. Metadata Section
- Place metadata at the **very top** of the document
- Use exact field names: `URL:`, `Meta-Title:`, `Meta-Description:`, etc.
- One field per line
- Leave a blank line after metadata before content starts

### 2. Title
- Use **Heading 1** style for the main title
- Make it descriptive and SEO-friendly
- Should appear after metadata section

### 3. Content Boundaries
- Start content with **"Introduction"** (as heading or bold)
- End content with **"Disclaimer"** (as heading or bold)
- Everything between Introduction and Disclaimer will be extracted
- Everything after Disclaimer will be removed

### 4. Formatting
- Use **Heading 2** or **Bold** for section headings
- Use regular paragraphs for body text
- Lists, bold, italic, underline will be preserved
- **Avoid** using Heading 1, Heading 2, Heading 3 tags in content (they'll be converted to paragraphs)
- Use built-in styles (Strong, Emphasis, Underline) for consistent formatting

### 5. Images (Optimized Guidelines)

#### Image Placement
- **First image** in document → Automatically becomes `featuredImage` in Strapi
- **All images** → Stored in `images` array in Strapi
- **Position**: Images can be placed **anywhere** in the content (not fixed position)
- **In content**: Images are replaced with placeholders like `[IMAGE 1: Alt text]` in the published content

#### Image Best Practices

**Recommended Image Specifications:**
- **Format**: JPG, PNG, or WebP
- **Size**: Maximum 2MB per image (for faster upload)
- **Dimensions**: 1200-1920px width (for web optimization)
- **Compression**: Compress images before adding to DOCX to reduce file size

**Image Optimization Tips:**
1. **Compress before adding**: Use tools like TinyPNG or ImageOptim before inserting into DOCX
2. **Use appropriate format**: 
   - JPG for photos/illustrations
   - PNG for graphics with transparency
   - WebP for modern browsers (if supported)
3. **Resize large images**: Don't insert 4K images - resize to web-friendly dimensions first
4. **Limit image count**: While unlimited images are supported, 5-10 images per article is optimal

**Image Alt Text:**
- Add alt text to images in DOCX (right-click → Alt Text)
- Or use "Image ALT:" in metadata for the first image
- Alt text improves SEO and accessibility

**What Happens to Images:**
1. Images are extracted from DOCX during conversion
2. Converted to proper file format (JPG/PNG)
3. Uploaded to Strapi Media Library
4. First image linked to `featuredImage` field
5. All images linked to `images` array field
6. Original image positions in content replaced with placeholders

### 6. What Gets Removed
The following will be automatically removed from published content:
- Metadata fields (URL, Meta-Title, etc.)
- ARTICLE SCHEMA (JSON-LD script tags)
- References section
- Everything after "Disclaimer"
- Base64 image data (images are stored separately in Strapi)

---

## Troubleshooting

### Metadata Not Extracted?
- Check that field names use colons: `Meta-Title:` not `Meta-Title-`
- Ensure there's a space after the colon
- Verify metadata is at the top of the document
- Check browser console (F12) for extraction logs

### Content Not Extracted?
- Ensure "Introduction" appears in your document
- Ensure "Disclaimer" appears in your document
- Check that these words are spelled correctly (case-insensitive)

### Title Not Extracted?
- Use Heading 1 style for the main title
- Place title after metadata section
- Avoid using "Introduction", "Disclaimer", or metadata field names as title

---

## Quick Checklist

Before exporting your DOCX, verify:

**Structure:**
- [ ] Metadata section at the top with all fields
- [ ] Main title using Heading 1 style
- [ ] "Introduction" section to mark content start
- [ ] "Disclaimer" section to mark content end
- [ ] No metadata fields in the content body
- [ ] Proper formatting (headings, paragraphs, lists)
- [ ] All content between Introduction and Disclaimer

**Images (if using):**
- [ ] Images are compressed (under 2MB each recommended)
- [ ] Images are in web-friendly format (JPG/PNG)
- [ ] Images have alt text (for SEO and accessibility)
- [ ] First image is the one you want as featured image
- [ ] Image count is reasonable (5-10 images optimal)

**Performance:**
- [ ] Document file size is reasonable (under 10MB total)
- [ ] Images are optimized before insertion
- [ ] No unnecessary formatting or styles
- [ ] Document structure follows the template

---

## Field Name Variations Supported

The extension supports multiple variations of field names:

| Standard | Variations Supported |
|----------|---------------------|
| `URL:` | `url:`, `Url:`, `URL -`, `url =` |
| `Meta-Title:` | `Meta-Title:`, `Meta Title:`, `metatitle:`, `metaTitle:` |
| `Meta-Description:` | `Meta-Description:`, `Meta Description:`, `metadescription:`, `metaDescription:` |
| `Meta-Keywords:` | `Meta-Keywords:`, `Meta Keywords:`, `metakeywords:`, `metaKeywords:` |
| `Image ALT:` | `Image ALT:`, `image alt:`, `imageAlt:`, `Image-ALT:` |
| `Publish At:` | `Publish At:`, `publishat:`, `PublishAt:`, `publish at:` |

**Separators supported:** `:`, `-`, `=`, `|`

---

## Example Use Cases

### Minimal Template (Only Required Fields)
```
Meta-Title: My Article Title

Meta-Description: My article description

Introduction

Your content here...

Disclaimer

[Your disclaimer text]
```

### Full Template (All Fields with Images)
```
URL: https://example.com/article

Meta-Title: Complete Article Title

Meta-Description: Full article description for SEO

Meta-Keywords: keyword1, keyword2, keyword3

Image ALT: Descriptive image alt text for featured image

Publish At: 2024-12-25T10:00:00.000Z

Main Article Title

[INSERT FIRST IMAGE HERE - This becomes featuredImage]

Introduction

Your introduction paragraph here.

Section Heading 1

Your content paragraph here.

[INSERT IMAGE HERE - Any position works]

More content here with another paragraph.

Section Heading 2

[INSERT ANOTHER IMAGE HERE]

Final content paragraph.

Final Thoughts

Your conclusion here.

Disclaimer

[Disclaimer text]
```

**Note**: Images can be placed anywhere in the content. The first image automatically becomes the featured image, and all images are stored in the images array.

---

## Optimized Tips for Best Results

### Document Structure
1. **Consistency**: Always use the same format for metadata fields
2. **Testing**: Test with a simple document first before creating complex ones
3. **Structure First**: Follow the exact structure (Metadata → Title → Content → Disclaimer)
4. **Clear Boundaries**: Use "Introduction" and "Disclaimer" markers consistently

### Images
1. **Optimize Before Insert**: Compress images to reduce DOCX file size
2. **First Image Strategy**: Place your best/most relevant image first (becomes featured image)
3. **Alt Text**: Always add descriptive alt text to images
4. **Reasonable Count**: Limit to 5-10 images per article for best performance
5. **Format Choice**: Use JPG for photos, PNG for graphics with transparency

### Performance
1. **File Size**: Keep total DOCX file size under 10MB
2. **Image Size**: Keep individual images under 2MB
3. **Clean Formatting**: Remove unnecessary styles or formatting
4. **Test Upload**: Test with a small document first to verify everything works

### Debugging
1. **Console Logs**: Check browser console (F12) to see what's being extracted
2. **Preview**: Review the preview in the extension before publishing
3. **Image Count**: Check console for "Extracted X images from DOCX" message
4. **Backup**: Keep a copy of your original document before publishing

### Text Style Preservation
The extension preserves these text styles automatically:
- **Headings**: H1, H2, H3 (converted from DOCX heading styles)
- **Bold**: Text with "Strong" style
- **Italic**: Text with "Emphasis" style
- **Underline**: Text with "Underline" style
- **Quotes**: Paragraphs with "Quote" style → blockquote
- **Lists**: Bullet and numbered lists preserved

**Pro Tip**: Use Google Docs built-in styles (Heading 1, Heading 2, Strong, Emphasis) for best results.

---

## Optimized Workflow Example

### Step-by-Step Process

1. **Prepare Images** (if using images):
   - Compress images to under 2MB each
   - Resize to web-friendly dimensions (1200-1920px width)
   - Choose appropriate format (JPG for photos, PNG for graphics)
   - Prepare alt text descriptions

2. **Create Document Structure**:
   - Start with metadata section at the top
   - Add main title with Heading 1 style
   - Insert first image (if using - becomes featured image)
   - Add "Introduction" heading
   - Add your content with images at any position
   - Add "Final Thoughts" section (optional)
   - End with "Disclaimer" section

3. **Format Content**:
   - Use Heading 2 or Bold for section headings
   - Use built-in styles (Strong, Emphasis, Underline)
   - Add alt text to all images
   - Keep formatting consistent

4. **Export and Test**:
   - Export as DOCX from Google Docs
   - Upload via Chrome extension
   - Check console logs for extraction status
   - Verify images were extracted and uploaded
   - Review preview before publishing

5. **Publish**:
   - Extension automatically uploads images to Strapi
   - First image becomes featured image
   - All images stored in images array
   - Content published with image placeholders

## Need Help?

### Extraction Issues

If extraction is not working:
1. Open browser console (F12 → Console tab)
2. Upload your DOCX file
3. Check the console logs for:
   - `Extracted metadata summary`
   - `Found metadata` messages
   - `Extracted X images from DOCX` message
   - Any error messages

### Image Issues

If images are not uploading:
1. Check console for image extraction logs
2. Verify images are under 2MB each
3. Check Strapi Media Library permissions
4. Verify API token has upload permissions
5. Check network tab for upload request errors

### Performance Issues

If document is slow to process:
1. Reduce total file size (compress images)
2. Reduce number of images (5-10 optimal)
3. Remove unnecessary formatting
4. Check browser console for performance warnings

The logs will show exactly what's being extracted and help identify any issues.

