# DOCX Template Guide for Strapi Publisher Extension

This guide provides a template for creating Google Docs documents that will be accurately parsed and published to Strapi using the Chrome extension.

## Document Structure

Your DOCX document should follow this exact structure for maximum accuracy:

```
METADATA SECTION (at the top)
↓
MAIN TITLE (as Heading 1)
↓
CONTENT SECTION (Introduction to Disclaimer)
↓
DISCLAIMER
```

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
- Lists, bold, italic will be preserved
- **Avoid** using Heading 1, Heading 2, Heading 3 tags in content (they'll be converted to paragraphs)

### 5. What Gets Removed
The following will be automatically removed from published content:
- Metadata fields (URL, Meta-Title, etc.)
- ARTICLE SCHEMA (JSON-LD script tags)
- References section
- Everything after "Disclaimer"

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

- [ ] Metadata section at the top with all fields
- [ ] Main title using Heading 1 style
- [ ] "Introduction" section to mark content start
- [ ] "Disclaimer" section to mark content end
- [ ] No metadata fields in the content body
- [ ] Proper formatting (headings, paragraphs, lists)
- [ ] All content between Introduction and Disclaimer

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

### Full Template (All Fields)
```
URL: https://example.com/article

Meta-Title: Complete Article Title

Meta-Description: Full article description for SEO

Meta-Keywords: keyword1, keyword2, keyword3

Image ALT: Descriptive image alt text

Publish At: 2024-12-25T10:00:00.000Z

Main Article Title

Introduction

Content here...

Disclaimer

[Disclaimer text]
```

---

## Tips for Best Results

1. **Consistency**: Always use the same format for metadata fields
2. **Testing**: Test with a simple document first before creating complex ones
3. **Console Logs**: Check browser console (F12) to see what's being extracted
4. **Preview**: Review the preview in the extension before publishing
5. **Backup**: Keep a copy of your original document before publishing

---

## Need Help?

If extraction is not working:
1. Open browser console (F12 → Console tab)
2. Upload your DOCX file
3. Check the console logs for:
   - `Extracted metadata summary`
   - `Found metadata` messages
   - Any error messages

The logs will show exactly what's being extracted and help identify any issues.

