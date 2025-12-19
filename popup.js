// Global variables
let parsedContent = null;
let extractedMetadata = null;

// DOM Elements
const docxFileInput = document.getElementById('docxFile');
const fileNameDisplay = document.getElementById('fileName');
const metadataSection = document.getElementById('metadataSection');
const previewSection = document.getElementById('previewSection');
const contentPreview = document.getElementById('contentPreview');
const statusDiv = document.getElementById('status');
const loadingDiv = document.getElementById('loading');
const saveConfigBtn = document.getElementById('saveConfig');
const publishBtn = document.getElementById('publishBtn');

// Configuration inputs
const strapiUrlInput = document.getElementById('strapiUrl');
const apiTokenInput = document.getElementById('apiToken');
const collectionTypeInput = document.getElementById('collectionType');

// Metadata inputs
const titleInput = document.getElementById('title');
const metaTitleInput = document.getElementById('metaTitle');
const metaDescInput = document.getElementById('metaDescription');
const metaKeywordsInput = document.getElementById('metaKeywords');
const canonicalUrlInput = document.getElementById('canonicalUrl');
const publishAtInput = document.getElementById('publishAt');

// Load saved configuration
chrome.storage.local.get(['strapiUrl', 'apiToken', 'collectionType'], (result) => {
  if (result.strapiUrl) strapiUrlInput.value = result.strapiUrl;
  if (result.apiToken) apiTokenInput.value = result.apiToken;
  if (result.collectionType) collectionTypeInput.value = result.collectionType;
});

// Save configuration
saveConfigBtn.addEventListener('click', () => {
  const config = {
    strapiUrl: strapiUrlInput.value.trim(),
    apiToken: apiTokenInput.value.trim(),
    collectionType: collectionTypeInput.value.trim()
  };
  
  if (!config.strapiUrl || !config.apiToken) {
    showStatus('Please fill in Strapi URL and API Token', 'error');
    return;
  }
  
  chrome.storage.local.set(config, () => {
    showStatus('Configuration saved successfully!', 'success');
  });
});

// File input change handler
docxFileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  fileNameDisplay.textContent = `Selected: ${file.name}`;
  showLoading(true);
  
  try {
    await parseDocxFile(file);
    showLoading(false);
    showStatus('Document parsed successfully! Review and edit metadata below.', 'success');
    metadataSection.classList.remove('hidden');
    previewSection.classList.remove('hidden');
  } catch (error) {
    showLoading(false);
    showStatus(`Error parsing document: ${error.message}`, 'error');
  }
});

// Parse DOCX file
async function parseDocxFile(file) {
  const arrayBuffer = await file.arrayBuffer();
  
  // Parse with mammoth
  const result = await mammoth.convertToHtml(
    { arrayBuffer: arrayBuffer },
    {
      styleMap: [
        "p[style-name='Heading 1'] => h1",
        "p[style-name='Heading 2'] => h2",
        "p[style-name='Heading 3'] => h3",
        "p[style-name='Quote'] => blockquote"
      ]
    }
  );
  
  let htmlContent = result.value;
  
  // Extract metadata from the beginning of the document
  extractedMetadata = extractMetadataFromContent(htmlContent);
  
  // Remove metadata section from content
  htmlContent = removeMetadataSection(htmlContent);
  
  // Handle images - replace with placeholders
  htmlContent = handleImages(htmlContent);
  
  // Handle tables (already in HTML from mammoth)
  
  // Store parsed content
  parsedContent = htmlContent;
  
  // Populate form fields
  titleInput.value = extractedMetadata.title || '';
  metaTitleInput.value = extractedMetadata.metaTitle || extractedMetadata.title || '';
  metaDescInput.value = extractedMetadata.metaDescription || '';
  metaKeywordsInput.value = extractedMetadata.metaKeywords || '';
  canonicalUrlInput.value = extractedMetadata.canonicalUrl || '';
  publishAtInput.value = extractedMetadata.publishAt || '';
  
  // Show preview
  contentPreview.innerHTML = parsedContent;
}

// Extract metadata from document content
function extractMetadataFromContent(html) {
  const metadata = {
    title: '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    canonicalUrl: '',
    publishAt: ''
  };
  
  // Create temporary div to parse HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  
  // Look for metadata in the first few paragraphs
  const paragraphs = tempDiv.querySelectorAll('p');
  const metadataPattern = /^(title|metaTitle|metaDescription|metaKeywords|canonicalUrl|canonicalURL|publishAt):\s*(.+)$/i;
  
  for (let i = 0; i < Math.min(15, paragraphs.length); i++) {
    const text = paragraphs[i].textContent.trim();
    const match = text.match(metadataPattern);
    
    if (match) {
      const key = match[1].toLowerCase();
      const value = match[2].trim();
      
      // Normalize key names
      if (key === 'canonicalurl') {
        metadata.canonicalUrl = value;
      } else if (key === 'metatitle') {
        metadata.metaTitle = value;
      } else if (key === 'metadescription') {
        metadata.metaDescription = value;
      } else if (key === 'metakeywords') {
        metadata.metaKeywords = value;
      } else if (key === 'publishat') {
        metadata.publishAt = value;
      } else {
        metadata[key] = value;
      }
    }
  }
  
  return metadata;
}

// Remove metadata section from content
function removeMetadataSection(html) {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  
  const paragraphs = tempDiv.querySelectorAll('p');
  const metadataPattern = /^(title|metaTitle|metaDescription|metaKeywords|canonicalUrl|canonicalURL|publishAt):\s*(.+)$/i;
  
  // Remove metadata paragraphs
  for (let i = 0; i < Math.min(15, paragraphs.length); i++) {
    const text = paragraphs[i].textContent.trim();
    if (metadataPattern.test(text)) {
      paragraphs[i].remove();
    }
  }
  
  return tempDiv.innerHTML;
}

// Handle images - replace with placeholders
function handleImages(html) {
  // Mammoth might not extract images by default, but if it does,
  // we'll replace them with placeholders
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  
  const images = tempDiv.querySelectorAll('img');
  images.forEach((img, index) => {
    const alt = img.alt || `Image ${index + 1}`;
    const placeholder = document.createElement('p');
    placeholder.innerHTML = `<strong>[IMAGE PLACEHOLDER: ${alt}]</strong>`;
    placeholder.style.color = '#e74c3c';
    placeholder.style.backgroundColor = '#ffeaa7';
    placeholder.style.padding = '10px';
    placeholder.style.borderRadius = '4px';
    img.parentNode.replaceChild(placeholder, img);
  });
  
  return tempDiv.innerHTML;
}

// Publish to Strapi
publishBtn.addEventListener('click', async () => {
  showLoading(true);
  
  try {
    // Get configuration
    const config = await new Promise((resolve) => {
      chrome.storage.local.get(['strapiUrl', 'apiToken', 'collectionType'], resolve);
    });
    
    if (!config.strapiUrl || !config.apiToken) {
      throw new Error('Please configure Strapi settings first');
    }
    
    // Prepare blog post data
    const blogData = {
      data: {
        title: titleInput.value.trim(),
        content: parsedContent,
        metaTitle: metaTitleInput.value.trim(),
        metaDescription: metaDescInput.value.trim(),
        metaKeywords: metaKeywordsInput.value.trim(),
        canonicalUrl: canonicalUrlInput.value.trim(),
      }
    };
    
    // Add publishAt if provided
    if (publishAtInput.value.trim()) {
      blogData.data.publishAt = publishAtInput.value.trim();
    }
    
    // Make API request to Strapi
    const response = await fetch(
      `${config.strapiUrl}/api/${config.collectionType}s`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiToken}`
        },
        body: JSON.stringify(blogData)
      }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    showLoading(false);
    showStatus(
      `✅ Blog post created successfully! ID: ${result.data.id}`,
      'success'
    );
    
    // Clear form after successful publish
    setTimeout(() => {
      resetForm();
    }, 3000);
    
  } catch (error) {
    showLoading(false);
    showStatus(`❌ Error publishing: ${error.message}`, 'error');
  }
});

// Utility functions
function showStatus(message, type) {
  statusDiv.textContent = message;
  statusDiv.className = `status ${type}`;
  statusDiv.classList.remove('hidden');
  
  if (type === 'success') {
    setTimeout(() => {
      statusDiv.classList.add('hidden');
    }, 5000);
  }
}

function showLoading(show) {
  if (show) {
    loadingDiv.classList.remove('hidden');
  } else {
    loadingDiv.classList.add('hidden');
  }
}

function resetForm() {
  docxFileInput.value = '';
  fileNameDisplay.textContent = '';
  metadataSection.classList.add('hidden');
  previewSection.classList.add('hidden');
  parsedContent = null;
  extractedMetadata = null;
  
  titleInput.value = '';
  metaTitleInput.value = '';
  metaDescInput.value = '';
  metaKeywordsInput.value = '';
  canonicalUrlInput.value = '';
  publishAtInput.value = '';
  contentPreview.innerHTML = '';
}