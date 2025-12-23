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
const testConnectionBtn = document.getElementById('testConnection');
const discoverTypesBtn = document.getElementById('discoverTypes');

// Configuration inputs
const strapiUrlInput = document.getElementById('strapiUrl');
const apiTokenInput = document.getElementById('apiToken');
const collectionTypeInput = document.getElementById('collectionType');
const contentFieldNameInput = document.getElementById('contentFieldName');

// Metadata inputs
const titleInput = document.getElementById('title');
const metaTitleInput = document.getElementById('metaTitle');
const metaDescInput = document.getElementById('metaDescription');
const metaKeywordsInput = document.getElementById('metaKeywords');
const canonicalUrlInput = document.getElementById('canonicalUrl');
const publishAtInput = document.getElementById('publishAt');

// Utility functions (defined early for accessibility)
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

function showDetailedError(message, endpoint, status) {
  // Build troubleshooting tips based on status code
  let troubleshootingTips = '';
  if (status === 403) {
    troubleshootingTips = '\n\nTroubleshooting 403 (Forbidden / Policy Failed):\n' +
      'This could be a permissions issue OR a policy blocking the request.\n\n' +
      'STEP 1: Check API Token Permissions\n' +
      '  1. Go to Strapi Admin → Settings → API Tokens\n' +
      '  2. Click on your API token to edit it\n' +
      '  3. Under "Token type", choose "Full access" (recommended for development)\n' +
      '  4. Save the token\n\n' +
      'STEP 2: Check Content Type Permissions\n' +
      '  1. Go to Settings → Users & Permissions Plugin → Roles\n' +
      '  2. Click on "Public" or "Authenticated"\n' +
      '  3. Find your content type in the list\n' +
      '  4. Ensure the "create" checkbox is enabled\n' +
      '  5. Save the role\n\n' +
      'STEP 3: Check for Custom Policies (if Policy Failed)\n' +
      '  1. Check your Strapi project: src/api/[content-type]/policies/\n' +
      '  2. Look for any custom policies that might block API requests\n' +
      '  3. Temporarily disable or modify policies for testing\n' +
      '  4. Or ensure your API token passes policy checks\n\n' +
      'STEP 4: Verify Endpoint\n' +
      '  - Test endpoint: ' + endpoint + '\n' +
      '  - Try GET request in browser (should return 200, 401, or 403, not 404)';
  } else if (status === 405) {
    troubleshootingTips = '\n\nTroubleshooting 405 (Method Not Allowed):\n' +
      'This error means the endpoint exists but POST method is not allowed.\n' +
      'This is ALWAYS a PERMISSIONS issue, not an endpoint format issue.\n\n' +
      'STEP 1: Check API Token Permissions\n' +
      '  1. Go to Strapi Admin → Settings → API Tokens\n' +
      '  2. Click on your API token to edit it\n' +
      '  3. Under "Token type", choose:\n' +
      '     - "Full access" (easiest, for development)\n' +
      '     - OR "Custom" and ensure "Create" is checked for your content type\n' +
      '  4. Save the token\n\n' +
      'STEP 2: Check Content Type Permissions\n' +
      '  1. Go to Settings → Users & Permissions Plugin → Roles\n' +
      '  2. Click on "Public" or "Authenticated" (depending on your setup)\n' +
      '  3. Find your content type in the list\n' +
      '  4. Ensure the "create" checkbox is enabled\n' +
      '  5. Save the role\n\n' +
      'STEP 3: Verify Endpoint\n' +
      '  - Test endpoint: ' + endpoint + '\n' +
      '  - Try GET request in browser (should return 200, 401, or 403, not 404)';
  } else if (status === 401 || status === 403) {
    troubleshootingTips = '\n\nTroubleshooting Authentication:\n' +
      '1. Verify your API Token is correct\n' +
      '2. Check token permissions in Strapi (Settings → API Tokens)\n' +
      '3. Ensure token has "Create" permission for this content type';
  } else if (status === 404) {
    troubleshootingTips = '\n\nTroubleshooting 404 (Not Found):\n' +
      '1. Verify the Collection Type name matches your Strapi content type\n' +
      '2. Check the Strapi Base URL is correct\n' +
      '3. Ensure the content type exists in Strapi';
  }
  
  // Show error with details
  const errorMsg = `Error (${status})\n\n${message}${troubleshootingTips}\n\nOpen browser console (F12 → Console tab) for detailed logs.`;
  statusDiv.textContent = errorMsg;
  statusDiv.className = 'status error';
  statusDiv.classList.remove('hidden');
  statusDiv.style.whiteSpace = 'pre-wrap'; // Allow line breaks
  statusDiv.style.maxHeight = '300px';
  statusDiv.style.overflowY = 'auto';
  statusDiv.style.fontSize = '12px';
  
  // Log to console with full details
  console.group('🚨 Publishing Error Details');
  console.error('Endpoint:', endpoint);
  console.error('Status:', status);
  console.error('Status Text:', message);
  console.error('Full Error Details:', message);
  if (troubleshootingTips) {
    console.info('Troubleshooting Tips:', troubleshootingTips);
  }
  console.groupEnd();
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

// Load saved configuration
chrome.storage.local.get(['strapiUrl', 'apiToken', 'collectionType', 'contentFieldName'], (result) => {
  if (result.strapiUrl) strapiUrlInput.value = result.strapiUrl;
  if (result.apiToken) apiTokenInput.value = result.apiToken;
  if (result.collectionType) collectionTypeInput.value = result.collectionType;
  if (result.contentFieldName) contentFieldNameInput.value = result.contentFieldName;
});

// Save configuration
saveConfigBtn.addEventListener('click', () => {
  const config = {
    strapiUrl: strapiUrlInput.value.trim(),
    apiToken: apiTokenInput.value.trim(),
    collectionType: collectionTypeInput.value.trim(),
    contentFieldName: contentFieldNameInput.value.trim() || 'content'
  };
  
  if (!config.strapiUrl || !config.apiToken) {
    showStatus('Please fill in Strapi URL and API Token', 'error');
    return;
  }
  
  chrome.storage.local.set(config, () => {
    showStatus('Configuration saved successfully!', 'success');
  });
});

// Test connection and permissions
testConnectionBtn.addEventListener('click', async () => {
  showLoading(true);
  
  const config = {
    strapiUrl: strapiUrlInput.value.trim(),
    apiToken: apiTokenInput.value.trim(),
    collectionType: collectionTypeInput.value.trim()
  };
  
  if (!config.strapiUrl || !config.apiToken || !config.collectionType) {
    showLoading(false);
    showStatus('Please fill in all configuration fields first', 'error');
    return;
  }
  
  try {
    // Strapi v5 uses plural endpoints by default
    const endpoints = [
      `${config.strapiUrl}/api/${config.collectionType}s`,  // Plural (Strapi v5 default)
      `${config.strapiUrl}/api/${config.collectionType}`    // Singular (backward compatibility)
    ];
    
    let testResults = [];
    
    for (const endpoint of endpoints) {
      console.log(`🔍 Testing endpoint: ${endpoint}`);
      
      // Test GET request (to see if endpoint exists)
      try {
        const getResponse = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${config.apiToken}`
          }
        });
        
        const getStatus = getResponse.status;
        const getStatusText = getResponse.statusText;
        
        // Test POST request (to check permissions)
        let postStatus = 'N/A';
        let postStatusText = 'N/A';
        let postErrorDetails = '';
        try {
          const postResponse = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${config.apiToken}`
            },
            body: JSON.stringify({ data: { title: 'Test' } })
          });
          postStatus = postResponse.status;
          postStatusText = postResponse.statusText;
          
          // If 405, try to get more details
          if (postResponse.status === 405) {
            try {
              const errorText = await postResponse.text();
              postErrorDetails = errorText.substring(0, 200); // First 200 chars
            } catch (e) {
              // Ignore
            }
          }
        } catch (postError) {
          postStatus = 'Error';
          postStatusText = postError.message;
        }
        
        testResults.push({
          endpoint: endpoint,
          getStatus: getStatus,
          getStatusText: getStatusText,
          postStatus: postStatus,
          postStatusText: postStatusText,
          postErrorDetails: postErrorDetails,
          exists: getStatus !== 404,
          canCreate: postStatus === 200 || postStatus === 201
        });
        
      } catch (error) {
        testResults.push({
          endpoint: endpoint,
          error: error.message
        });
      }
    }
    
    // Build result message
    let resultMessage = 'Connection Test Results:\n\n';
    
    testResults.forEach((result, index) => {
      resultMessage += `Endpoint ${index + 1}: ${result.endpoint}\n`;
      if (result.error) {
        resultMessage += `  Error: ${result.error}\n`;
      } else {
        resultMessage += `  GET: ${result.getStatus} ${result.getStatusText}\n`;
        resultMessage += `  POST: ${result.postStatus} ${result.postStatusText}\n`;
        
        if (!result.exists) {
          resultMessage += `  Endpoint does not exist (404)\n`;
        } else if (result.canCreate) {
          resultMessage += `  POST is allowed! This endpoint should work.\n`;
        } else if (result.postStatus === 400) {
          resultMessage += `  POST works but data format is wrong (400 Bad Request)\n`;
          resultMessage += `  Good news: POST is allowed! Just need to fix the data format.\n`;
        } else if (result.postStatus === 405) {
          resultMessage += `  POST not allowed (405) - PERMISSIONS ISSUE\n`;
          if (result.postErrorDetails) {
            resultMessage += `  Error details: ${result.postErrorDetails}\n`;
          }
          resultMessage += `  Even with "Full access" token, you're getting 405.\n`;
          resultMessage += `  This might mean:\n`;
          resultMessage += `  1. Token is not actually "Full access" - double check in Strapi\n`;
          resultMessage += `  2. Token value is wrong - copy it again from Strapi\n`;
          resultMessage += `  3. Strapi version issue - try restarting Strapi\n`;
          resultMessage += `  4. Wrong endpoint - endpoint might not support POST\n`;
        } else if (result.postStatus === 401 || result.postStatus === 403) {
          resultMessage += `  Authentication issue (${result.postStatus})\n`;
          resultMessage += `  Check: Is your API token correct? Is it "Full access"?\n`;
        }
      }
      resultMessage += '\n';
    });
    
    // Add recommendations
    const has405 = testResults.some(r => r.postStatus === 405);
    const has400 = testResults.some(r => r.postStatus === 400);
    const hasValidEndpoint = testResults.some(r => r.exists && !r.error);
    const canCreateAny = testResults.some(r => r.canCreate);
    
    if (canCreateAny) {
      resultMessage += 'At least one endpoint allows POST. You should be able to publish!\n';
    } else if (has400 && hasValidEndpoint) {
      resultMessage += 'DATA FORMAT ISSUE DETECTED:\n';
      resultMessage += 'Good news: POST is allowed! The endpoint works.\n';
      resultMessage += 'Bad news: The request data format is incorrect.\n\n';
      resultMessage += 'This usually means:\n';
      resultMessage += '1. Required fields are missing\n';
      resultMessage += '2. Field names don\'t match your Strapi schema\n';
      resultMessage += '3. Data types are wrong (e.g., string vs number)\n\n';
      resultMessage += 'To fix:\n';
      resultMessage += '1. Try publishing - the error message will show which fields are wrong\n';
      resultMessage += '2. Check Strapi Content-Type Builder → ' + config.collectionType + '\n';
      resultMessage += '3. Verify required fields (marked with *) are included\n';
      resultMessage += '4. Check field names match exactly (case-sensitive)\n';
      resultMessage += '5. Ensure field types match (text, richtext, etc.)\n';
    } else if (has405 && hasValidEndpoint) {
      resultMessage += 'PERMISSIONS ISSUE DETECTED:\n';
      resultMessage += 'The endpoint exists but POST is not allowed.\n\n';
      resultMessage += 'IMPORTANT: Admin panel permissions ≠ API permissions!\n';
      resultMessage += 'Your user roles (Editor, Super Admin, Author) control the ADMIN PANEL.\n';
      resultMessage += 'API access is controlled by:\n';
      resultMessage += '  1. API Token permissions\n';
      resultMessage += '  2. Public/Authenticated role permissions\n\n';
      resultMessage += 'STEP 1: Verify API Token is "Full Access"\n';
      resultMessage += '  IMPORTANT: With "Full access" token, you DON\'T need to see "create" checkbox!\n';
      resultMessage += '  The token bypasses all permissions automatically.\n\n';
      resultMessage += '  To verify your token:\n';
      resultMessage += '  1. Go to: Settings → API Tokens\n';
      resultMessage += '  2. Click on your API token\n';
      resultMessage += '  3. Check that "Token type" shows "Full access"\n';
      resultMessage += '  4. If it says "Custom" or something else, change it to "Full access"\n';
      resultMessage += '  5. Click "Save"\n';
      resultMessage += '  6. Copy the token value again (it might have changed)\n';
      resultMessage += '  7. Paste it into the extension\'s "API Token" field\n';
      resultMessage += '  8. Click "Save Configuration" in the extension\n\n';
      resultMessage += '  You DON\'T need to look for "create" checkbox anywhere!\n';
      resultMessage += '     "Full access" token works without it.\n\n';
      resultMessage += 'STEP 2: Use "Full Access" API Token (RECOMMENDED)\n';
      resultMessage += '  If "create" checkbox is not showing, use this method:\n';
      resultMessage += '  1. Go to: Settings → API Tokens\n';
      resultMessage += '  2. Click on your API token (or create a new one)\n';
      resultMessage += '  3. Under "Token type", select "Full access"\n';
      resultMessage += '  4. Click "Save"\n';
      resultMessage += '  5. This bypasses ALL content type permissions\n';
      resultMessage += '  6. Test again - should work immediately!\n\n';
      resultMessage += 'STEP 3: Alternative - Fix Content Type Permissions\n';
      resultMessage += '  (Only needed if you can\'t use Full access token)\n';
      resultMessage += '  1. Go to: Settings → Users & Permissions Plugin → Roles\n';
      resultMessage += '  2. Click on "Public" (for public API access)\n';
      resultMessage += '  3. Look for "' + config.collectionType + '" in the list\n';
      resultMessage += '  4. If you only see "find" and "update":\n';
      resultMessage += '     - This might be a Strapi UI bug\n';
      resultMessage += '     - Try refreshing the page\n';
      resultMessage += '     - Try restarting Strapi\n';
      resultMessage += '     - Check Strapi version (might need update)\n';
      resultMessage += '  5. If "create" appears, check it and click "Save"\n\n';
      resultMessage += 'IMPORTANT: "Full access" token is the EASIEST solution!\n';
      resultMessage += '   It works even if "create" checkbox doesn\'t show.\n';
      resultMessage += '   Just set your API token to "Full access" and you\'re done.';
    } else if (!hasValidEndpoint) {
      resultMessage += 'No valid endpoints found (404 on both endpoints).\n\n';
      resultMessage += 'This means the collection type name is incorrect.\n\n';
      resultMessage += 'SOLUTION: Click "Discover Content Types" button above\n';
      resultMessage += '   to automatically find the correct collection type name.\n\n';
      resultMessage += 'Or manually check:\n';
      resultMessage += '1. Strapi Admin → Content Manager → Look at left sidebar\n';
      resultMessage += '2. Settings → Content-Type Builder → Click your content type\n';
      resultMessage += '3. Find the "API ID" field - that\'s your collection type name\n';
      resultMessage += '4. It should be singular, lowercase, with hyphens (e.g., "blog-post")\n';
    }
    
    showLoading(false);
    showStatus(resultMessage, canCreateAny ? 'success' : 'error');
    statusDiv.style.whiteSpace = 'pre-wrap';
    statusDiv.style.maxHeight = '400px';
    statusDiv.style.overflowY = 'auto';
    
    console.group('🔍 Connection Test Results');
    console.table(testResults);
    console.groupEnd();
    
  } catch (error) {
    showLoading(false);
    showStatus(`Test failed: ${error.message}`, 'error');
    console.error('Test connection error:', error);
  }
});

// Discover available content types
discoverTypesBtn.addEventListener('click', async () => {
  showLoading(true);
  
  const config = {
    strapiUrl: strapiUrlInput.value.trim(),
    apiToken: apiTokenInput.value.trim()
  };
  
  if (!config.strapiUrl || !config.apiToken) {
    showLoading(false);
    showStatus('Please fill in Strapi URL and API Token first', 'error');
    return;
  }
  
  try {
    let discoveredTypes = [];
    let errorMessage = '';
    
    // Try to get content types from Strapi Content Manager API
    // In Strapi v4, we can try the content manager endpoint
    const contentManagerUrl = `${config.strapiUrl}/api/content-manager/collection-types`;
    
    try {
      const response = await fetch(contentManagerUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${config.apiToken}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data && Array.isArray(data)) {
          discoveredTypes = data.map(item => ({
            uid: item.uid || item.apiID,
            kind: item.kind || 'collection',
            name: item.info?.singularName || item.info?.name || item.uid
          }));
        }
      }
    } catch (e) {
      console.log('Content Manager API not accessible, trying alternative methods...');
    }
    
    // If that didn't work, try common content type names
    if (discoveredTypes.length === 0) {
      const commonTypes = [
        'blog-post', 'blog-posts', 'article', 'articles', 'post', 'posts',
        'page', 'pages', 'content', 'contents', 'blog', 'blogs',
        'news', 'news-item', 'news-items', 'story', 'stories'
      ];
      
      console.log('Trying common content type names...');
      
      for (const typeName of commonTypes) {
        const endpoints = [
          `${config.strapiUrl}/api/${typeName}`,
          `${config.strapiUrl}/api/${typeName}s`
        ];
        
        for (const endpoint of endpoints) {
          try {
            const testResponse = await fetch(endpoint, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${config.apiToken}`
              }
            });
            
            // If we get 200, 401, 403, or 405 (not 404), the endpoint exists
            if (testResponse.status !== 404) {
              const cleanName = typeName.endsWith('s') ? typeName.slice(0, -1) : typeName;
              if (!discoveredTypes.find(t => t.name === cleanName)) {
                discoveredTypes.push({
                  uid: cleanName,
                  kind: 'collection',
                  name: cleanName,
                  status: testResponse.status
                });
              }
            }
          } catch (e) {
            // Continue trying
          }
        }
      }
    }
    
    // Build result message
    let resultMessage = 'Discovered Content Types:\n\n';
    
    if (discoveredTypes.length > 0) {
      resultMessage += 'Found the following content types:\n\n';
      discoveredTypes.forEach((type, index) => {
        resultMessage += `${index + 1}. ${type.name} (${type.uid})\n`;
        if (type.status) {
          if (type.status === 403) {
            resultMessage += `   Endpoint exists! Status: 403 (Forbidden - permissions issue)\n`;
            resultMessage += `   This is the correct name, but you need to fix permissions.\n`;
          } else if (type.status === 401) {
            resultMessage += `   Status: 401 (Unauthorized - check API token)\n`;
          } else if (type.status === 200) {
            resultMessage += `   Status: 200 (Perfect! Endpoint works)\n`;
          } else {
            resultMessage += `   Status: ${type.status}\n`;
          }
        }
      });
      resultMessage += '\nCopy one of these names and paste it into "Collection Type" field.\n';
      resultMessage += '   Use the singular form (e.g., "blog-post" not "blog-posts").\n';
      
      // If we found types with 403, provide specific guidance
      const has403 = discoveredTypes.some(t => t.status === 403);
      if (has403) {
        resultMessage += '\n🔧 PERMISSIONS FIX NEEDED:\n';
        resultMessage += 'The endpoint exists (403 = Forbidden, not 404 = Not Found).\n';
        resultMessage += 'This means your API token needs permissions.\n\n';
        resultMessage += 'To fix:\n';
        resultMessage += '1. Strapi Admin → Settings → API Tokens\n';
        resultMessage += '2. Edit your API token\n';
        resultMessage += '3. Set Token type to "Full access" (for development)\n';
        resultMessage += '   OR select "Custom" and enable "Create" for your content type\n';
        resultMessage += '4. Save the token\n';
        resultMessage += '5. Also check: Settings → Users & Permissions → Roles\n';
        resultMessage += '6. Enable "create" permission for your content type\n';
      }
    } else {
      resultMessage += '❌ Could not automatically discover content types.\n\n';
      resultMessage += 'To find your content type name manually:\n';
      resultMessage += '1. Open Strapi Admin Panel\n';
      resultMessage += '2. Go to Content Manager\n';
      resultMessage += '3. Look at the left sidebar - you\'ll see your content types\n';
      resultMessage += '4. Click on a content type to see its details\n';
      resultMessage += '5. The API ID (singular name) is what you need\n';
      resultMessage += '   Example: If you see "Blog Posts", the API ID might be "blog-post"\n\n';
      resultMessage += 'Or check in Strapi:\n';
      resultMessage += 'Settings → Content-Type Builder → Click your content type → API ID\n';
    }
    
    resultMessage += '\n📝 Common patterns:\n';
    resultMessage += '- If content type is "Blog Posts" → try "blog-post"\n';
    resultMessage += '- If content type is "Articles" → try "article"\n';
    resultMessage += '- The name is usually lowercase with hyphens\n';
    resultMessage += '- It\'s the singular form, not plural\n';
    
    showLoading(false);
    showStatus(resultMessage, discoveredTypes.length > 0 ? 'success' : 'info');
    statusDiv.style.whiteSpace = 'pre-wrap';
    statusDiv.style.maxHeight = '400px';
    statusDiv.style.overflowY = 'auto';
    
    console.group('🔎 Content Type Discovery');
    console.log('Discovered types:', discoveredTypes);
    console.groupEnd();
    
  } catch (error) {
    showLoading(false);
    showStatus(`❌ Discovery failed: ${error.message}`, 'error');
    console.error('Discover types error:', error);
  }
});

// File input change handler
docxFileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  fileNameDisplay.textContent = `Selected: ${file.name}`;
  showLoading(true);
  
  try {
    await parseDocxFile(file);
    
    // If title is still empty after parsing, use filename as fallback
    if (!titleInput.value || titleInput.value.trim() === '') {
      const fileNameWithoutExt = file.name.replace(/\.docx?$/i, '').trim();
      if (fileNameWithoutExt) {
        titleInput.value = fileNameWithoutExt;
        console.log('📝 Using filename as title fallback:', fileNameWithoutExt);
      }
    }
    
    showLoading(false);
    showStatus('Document parsed successfully! Review and edit metadata below.', 'success');
    metadataSection.classList.remove('hidden');
    previewSection.classList.remove('hidden');
    
    // Scroll to metadata section to make it visible
    metadataSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } catch (error) {
    console.error('❌ Error parsing document:', error);
    showLoading(false);
    showStatus(`Error parsing document: ${error.message}`, 'error');
  }
});

// Parse DOCX file
async function parseDocxFile(file) {
  console.log('📄 Starting to parse DOCX file:', file.name);
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
  console.log('DOCX converted to HTML, length:', htmlContent.length);
  console.log('First 500 chars of HTML:', htmlContent.substring(0, 500));
  
  // Extract headings before removing metadata (for title fallback)
  const tempDivForHeadings = document.createElement('div');
  tempDivForHeadings.innerHTML = htmlContent;
  const headings = tempDivForHeadings.querySelectorAll('h1, h2, h3');
  console.log('Found headings:', headings.length);
  
  // Extract metadata from the beginning of the document
  extractedMetadata = extractMetadataFromContent(htmlContent);
  console.log('Extracted metadata:', extractedMetadata);
  
  // Remove metadata section from content
  htmlContent = removeMetadataSection(htmlContent);
  
  // Handle images - replace with placeholders
  htmlContent = handleImages(htmlContent);
  
  // Handle tables (already in HTML from mammoth)
  
  // Store parsed content
  parsedContent = htmlContent;
  
  // Populate form fields - with validation and logging
  console.log('Populating form fields...');
  console.log('  - Title input element exists:', !!titleInput);
  console.log('  - Extracted metadata:', extractedMetadata);
  
  // Validate all required DOM elements exist
  const requiredElements = {
    titleInput,
    metaTitleInput,
    metaDescInput,
    metaKeywordsInput,
    canonicalUrlInput,
    publishAtInput,
    contentPreview
  };
  
  const missingElements = Object.entries(requiredElements)
    .filter(([name, element]) => !element)
    .map(([name]) => name);
  
  if (missingElements.length > 0) {
    console.error('Missing DOM elements:', missingElements);
    throw new Error(`Missing required DOM elements: ${missingElements.join(', ')}`);
  }
  
  // Populate title field - ensure it's always set
  let titleValue = extractedMetadata.title || '';
  
  // If title is still empty, try to extract from first heading
  if (!titleValue && headings.length > 0) {
    const firstHeading = headings[0].textContent.trim();
    if (firstHeading) {
      titleValue = firstHeading;
      console.log('  - Using first heading as title:', titleValue);
    }
  }
  
  // Set title field
  if (titleInput) {
    titleInput.value = titleValue;
    console.log('  - Title field set to:', titleInput.value || '(empty)');
  }
  
  // Populate meta title (use title as fallback)
  const metaTitleValue = extractedMetadata.metaTitle || titleValue || '';
  if (metaTitleInput) {
    metaTitleInput.value = metaTitleValue;
    console.log('  - Meta Title field set to:', metaTitleInput.value || '(empty)');
  }
  
  // Populate meta description
  if (metaDescInput) {
    metaDescInput.value = extractedMetadata.metaDescription || '';
    console.log('  - Meta Description field set to:', metaDescInput.value || '(empty)');
  }
  
  // Populate meta keywords
  if (metaKeywordsInput) {
    metaKeywordsInput.value = extractedMetadata.metaKeywords || '';
    console.log('  - Meta Keywords field set to:', metaKeywordsInput.value || '(empty)');
  }
  
  // Populate canonical URL
  if (canonicalUrlInput) {
    canonicalUrlInput.value = extractedMetadata.canonicalUrl || '';
    console.log('  - Canonical URL field set to:', canonicalUrlInput.value || '(empty)');
  }
  
  // Populate publish at
  if (publishAtInput) {
    publishAtInput.value = extractedMetadata.publishAt || '';
    console.log('  - Publish At field set to:', publishAtInput.value || '(empty)');
  }
  
  // Visual feedback: highlight fields that were populated
  if (titleValue && titleInput) {
    titleInput.style.borderColor = '#4CAF50';
    setTimeout(() => { if (titleInput) titleInput.style.borderColor = ''; }, 2000);
  }
  if (metaTitleValue && metaTitleInput) {
    metaTitleInput.style.borderColor = '#4CAF50';
    setTimeout(() => { if (metaTitleInput) metaTitleInput.style.borderColor = ''; }, 2000);
  }
  
  // Show preview
  if (contentPreview) {
    contentPreview.innerHTML = parsedContent;
    console.log('Preview updated');
  }
  
  console.log('Document parsing complete!');
}

// Extract metadata from document content
function extractMetadataFromContent(html) {
  console.log('🔍 Starting metadata extraction...');
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
  
  // Debug: Log structure
  const paragraphs = tempDiv.querySelectorAll('p');
  const headings = tempDiv.querySelectorAll('h1, h2, h3');
  console.log(`📊 Document structure: ${paragraphs.length} paragraphs, ${headings.length} headings`);
  
  // Look for metadata in the first few paragraphs (expanded to 50 for better coverage)
  // Support multiple formats:
  // 1. "title: value"
  // 2. "Title: value"
  // 3. "TITLE: value"
  // 4. "title - value"
  // 5. "Title | value"
  const metadataPatterns = [
    /^(title|metaTitle|metaDescription|metaKeywords|canonicalUrl|canonicalURL|publishAt)[:\-\|]\s*(.+)$/i,
    /^(title|metaTitle|metaDescription|metaKeywords|canonicalUrl|canonicalURL|publishAt)\s*=\s*(.+)$/i
  ];
  
  for (let i = 0; i < Math.min(50, paragraphs.length); i++) {
    const text = paragraphs[i].textContent.trim();
    
    // Try each pattern
    for (const pattern of metadataPatterns) {
      const match = text.match(pattern);
      
      if (match) {
        const key = match[1].toLowerCase();
        const value = match[2].trim();
        console.log(`Found metadata: ${key} = ${value.substring(0, 50)}...`);
        
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
        } else if (key === 'title') {
          metadata.title = value;
        }
        break; // Found a match, move to next paragraph
      }
    }
  }
  
  // Fallback: If title is still empty, try to extract from first heading (h1, h2, h3)
  if (!metadata.title || metadata.title.trim() === '') {
    console.log('🔍 Title not found in metadata, trying headings...');
    if (headings.length > 0) {
      const firstHeading = headings[0].textContent.trim();
      if (firstHeading) {
        metadata.title = firstHeading;
        console.log('✅ Extracted title from first heading:', metadata.title);
      }
    } else {
      console.log('⚠️ No headings found in document');
    }
  }
  
  // Fallback: If still no title, use first paragraph (truncated to 100 chars)
  if (!metadata.title || metadata.title.trim() === '') {
    console.log('🔍 Title still not found, trying first paragraph...');
    const firstParagraph = tempDiv.querySelector('p');
    if (firstParagraph) {
      const text = firstParagraph.textContent.trim();
      if (text && text.length > 0) {
        // Skip if it looks like metadata (contains colon)
        if (!text.includes(':')) {
          metadata.title = text.length > 100 ? text.substring(0, 100) + '...' : text;
          console.log('✅ Extracted title from first paragraph:', metadata.title);
        } else {
          console.log('⚠️ First paragraph looks like metadata, skipping');
        }
      }
    }
  }
  
  // Final fallback: Use document filename (without extension) as title
  if (!metadata.title || metadata.title.trim() === '') {
    console.log('🔍 Title still not found, using fallback...');
    // This will be handled by the caller if needed
    console.log('⚠️ No title could be extracted from document');
  }
  
  console.log('📊 Final extracted metadata:', metadata);
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
      chrome.storage.local.get(['strapiUrl', 'apiToken', 'collectionType', 'contentFieldName'], resolve);
    });
    
    if (!config.strapiUrl || !config.apiToken) {
      throw new Error('Please configure Strapi settings first');
    }
    
    // Prepare blog post data - only include fields with values
    const blogData = {
      data: {}
    };
    
    // Add title (required) - always include it, validate it's not empty
    let titleValue = titleInput.value.trim();
    
    // Fallback: If title is still empty, try to use filename or a default
    if (!titleValue) {
      // Try to get filename from the file input
      const file = docxFileInput.files[0];
      if (file) {
        const fileNameWithoutExt = file.name.replace(/\.docx?$/i, '').trim();
        if (fileNameWithoutExt) {
          titleValue = fileNameWithoutExt;
          titleInput.value = titleValue; // Update the input field
          console.log('⚠️ Title was empty, using filename as fallback:', titleValue);
        }
      }
    }
    
    // Final check: if still empty, use a default
    if (!titleValue) {
      titleValue = 'Untitled Post';
      titleInput.value = titleValue; // Update the input field
      console.log('⚠️ Title was empty, using default:', titleValue);
    }
    
    // Always include title - it's required by Strapi
    blogData.data.title = titleValue;
    console.log('✅ Title included in request:', titleValue);
    
    // Add content field (use configured field name, default to 'content')
    let contentFieldName = config.contentFieldName || 'content';
    if (contentFieldNameInput && contentFieldNameInput.value.trim()) {
      contentFieldName = contentFieldNameInput.value.trim();
    }
    if (parsedContent) {
      blogData.data[contentFieldName] = parsedContent;
    }
    
    // Add optional metadata fields only if they have values
    if (metaTitleInput.value.trim()) {
      blogData.data.metaTitle = metaTitleInput.value.trim();
    }
    if (metaDescInput.value.trim()) {
      blogData.data.metaDescription = metaDescInput.value.trim();
    }
    if (metaKeywordsInput.value.trim()) {
      blogData.data.metaKeywords = metaKeywordsInput.value.trim();
    }
    if (canonicalUrlInput.value.trim()) {
      blogData.data.canonicalUrl = canonicalUrlInput.value.trim();
    }
    if (publishAtInput.value.trim()) {
      blogData.data.publishAt = publishAtInput.value.trim();
    }
    
    // Log the data being sent for debugging
    console.log('📦 Data being sent to Strapi:', JSON.stringify(blogData, null, 2));
    
    // Make API request to Strapi
    // Strapi v5 uses plural endpoints by default (e.g., /api/blog-posts)
    // Try plural first, then singular for backward compatibility
    const endpoints = [
      `${config.strapiUrl}/api/${config.collectionType}s`,  // Plural (Strapi v5 default)
      `${config.strapiUrl}/api/${config.collectionType}`   // Singular (backward compatibility)
    ];
    
    // First, test which endpoint exists with a GET request
    let validEndpoint = null;
    console.log('🔍 Testing endpoints to find the correct one...');
    
    for (const endpoint of endpoints) {
      try {
        const testResponse = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${config.apiToken}`
          }
        });
        
        console.log(`🔍 Test GET ${endpoint}:`, {
          status: testResponse.status,
          statusText: testResponse.statusText
        });
        
        // If we get 200 or 401/403 (endpoint exists but needs auth), this is the right endpoint
        // 404 means endpoint doesn't exist
        // 405 on GET would be weird, but we'll accept it
        if (testResponse.status !== 404) {
          validEndpoint = endpoint;
          console.log(`✅ Found valid endpoint: ${endpoint}`);
          break;
        }
      } catch (testError) {
        console.log(`❌ Error testing ${endpoint}:`, testError);
      }
    }
    
    // Use valid endpoint if found, otherwise try both
    const endpointsToTry = validEndpoint ? [validEndpoint] : endpoints;
    let response = null;
    let lastEndpoint = '';
    let lastError = null;
    
    // Try each endpoint until one works
    for (const endpoint of endpointsToTry) {
      lastEndpoint = endpoint;
      
      // Log request details for debugging
      console.log('🚀 Publishing to Strapi:', {
        endpoint: endpoint,
        method: 'POST',
        collectionType: config.collectionType,
        hasContent: !!parsedContent,
        title: blogData.data.title
      });
      
      try {
        response = await fetch(
          endpoint,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiToken}`
        },
        body: JSON.stringify(blogData)
      }
    );
    
        // Log response details
        console.log('📡 Response received:', {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
          endpoint: endpoint
        });
        
        // If successful, break out of loop
        if (response.ok) {
          console.log('✅ Success with endpoint:', endpoint);
          break;
        }
        
        // If 405 and we have another endpoint to try, continue
        if (response.status === 405 && endpointsToTry.indexOf(endpoint) < endpointsToTry.length - 1) {
          console.log('⚠️ Got 405, trying next endpoint...');
          continue;
        }
        
        // If 400, log the error details to help debug
        if (response.status === 400) {
          try {
            const errorData = await response.clone().json();
            console.error('❌ 400 Bad Request details:', errorData);
          } catch (e) {
            const errorText = await response.clone().text();
            console.error('❌ 400 Bad Request text:', errorText);
          }
        }
        
        // Otherwise, handle the error
        break;
        
      } catch (fetchError) {
        console.error('❌ Fetch error:', fetchError);
        lastError = fetchError;
        // Continue to next endpoint if available
        if (endpointsToTry.indexOf(endpoint) < endpointsToTry.length - 1) {
          continue;
        }
        throw fetchError;
      }
    }
    
    // Handle error response
    if (!response || !response.ok) {
      // Try to parse error response as JSON, but handle plain text errors
      let errorMessage = `HTTP ${response?.status || 'Network Error'}: ${response?.statusText || lastError?.message || 'Unknown error'}`;
      let errorDetails = '';
      
      if (response) {
        try {
          const contentType = response.headers.get('content-type');
          console.log('📄 Error response content-type:', contentType);
          
          if (contentType && contentType.includes('application/json')) {
      const errorData = await response.json();
            console.error('❌ Error data:', errorData);
            
            // Check for PolicyError (Policy Failed)
            if (errorData.error?.name === 'PolicyError' || errorData.error?.message === 'Policy Failed') {
              errorMessage = 'Policy Failed - A Strapi policy is blocking this request';
              errorDetails = JSON.stringify(errorData, null, 2);
            } 
            // Handle 400 Bad Request with field-level errors
            else if (response.status === 400 && errorData.error?.details?.errors) {
              const fieldErrors = errorData.error.details.errors;
              errorMessage = `400 Bad Request - ${errorData.error.message || 'Invalid data format'}`;
              
              // Build detailed field error list
              let fieldErrorList = '\n\nField-level errors:\n';
              fieldErrors.forEach((err, index) => {
                const fieldPath = Array.isArray(err.path) ? err.path.join('.') : err.path;
                fieldErrorList += `${index + 1}. Field "${fieldPath}": ${err.message}\n`;
              });
              
              errorDetails = fieldErrorList + '\nFull error details:\n' + JSON.stringify(errorData, null, 2);
            } 
            // Handle "Invalid key" errors (field doesn't exist)
            else if (response.status === 400 && errorData.error?.message?.includes('Invalid key')) {
              const invalidKey = errorData.error.details?.key || 'unknown';
              errorMessage = `400 Bad Request - Field "${invalidKey}" doesn't exist in your Strapi content type`;
              
              // Provide helpful suggestions
              let suggestions = '\n\n💡 SOLUTION:\n';
              if (invalidKey === 'content') {
                suggestions += 'The field "content" doesn\'t exist in your blog-post content type.\n\n';
                suggestions += 'Option 1: Check your Strapi field name\n';
                suggestions += '  1. Go to Strapi Admin → Content-Type Builder → blog-post\n';
                suggestions += '  2. Look at your fields - the content field might be named:\n';
                suggestions += '     - "body" (most common)\n';
                suggestions += '     - "text"\n';
                suggestions += '     - "article"\n';
                suggestions += '     - "description"\n';
                suggestions += '     - "contentBody"\n';
                suggestions += '  3. Note the exact field name (case-sensitive)\n\n';
                suggestions += 'Option 2: Add a "content" field to your content type\n';
                suggestions += '  1. Go to Strapi Admin → Content-Type Builder → blog-post\n';
                suggestions += '  2. Click "Add another field"\n';
                suggestions += '  3. Add a "Rich text" field named "content"\n';
                suggestions += '  4. Save the content type\n';
              } else {
                suggestions += `The field "${invalidKey}" doesn't exist in your content type.\n\n`;
                suggestions += 'To fix:\n';
                suggestions += '1. Go to Strapi Admin → Content-Type Builder → ' + config.collectionType + '\n';
                suggestions += '2. Check what fields actually exist\n';
                suggestions += '3. Either:\n';
                suggestions += '   - Remove this field from the request, OR\n';
                suggestions += '   - Add this field to your content type\n';
              }
              
              errorDetails = suggestions + '\nFull error details:\n' + JSON.stringify(errorData, null, 2);
            }
            // Handle other 400 errors
            else if (response.status === 400) {
              errorMessage = errorData.error?.message || errorData.message || '400 Bad Request - Invalid data format';
              errorDetails = JSON.stringify(errorData, null, 2);
            } 
            // Handle other errors
            else {
              errorMessage = errorData.error?.message || errorData.message || errorMessage;
              errorDetails = JSON.stringify(errorData, null, 2);
            }
          } else {
            // If not JSON, read as text
            const errorText = await response.text();
            console.error('❌ Error text:', errorText);
            errorMessage = errorText || errorMessage;
            errorDetails = errorText;
          }
        } catch (parseError) {
          console.error('❌ Error parsing response:', parseError);
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
      }
      
      // Build detailed error message
      let fullErrorMessage = `${errorMessage}\n\nEndpoint: ${lastEndpoint}\nMethod: POST\nStatus: ${response?.status || 'N/A'}`;
      if (errorDetails) {
        fullErrorMessage += `\n\nDetails:\n${errorDetails}`;
      }
      if (endpointsToTry.length > 1) {
        fullErrorMessage += `\n\nTried endpoints:\n- ${endpointsToTry.join('\n- ')}`;
      }
      
      // Check for 400 Bad Request (data format issue)
      if (response?.status === 400) {
        fullErrorMessage += `\n\n⚠️ 400 BAD REQUEST - Data Format Issue:\n` +
          `Good news: The endpoint exists and POST is allowed! ✅\n` +
          `Bad news: The request data format is incorrect.\n\n` +
          `Common causes:\n` +
          `1. Required fields are missing from your content type\n` +
          `2. Field names don't match your Strapi schema\n` +
          `3. Data types don't match (e.g., string vs number)\n` +
          `4. Invalid date format for publishAt field\n\n` +
          `To fix:\n` +
          `1. Check the error details above - it will show which fields are invalid\n` +
          `2. Go to Strapi Admin → Content-Type Builder → ${config.collectionType}\n` +
          `3. Check which fields are required (marked with *)\n` +
          `4. Verify field names match exactly (case-sensitive)\n` +
          `5. Check field types match (text, richtext, date, etc.)\n` +
          `6. If publishAt is set, ensure it's in ISO format: YYYY-MM-DDTHH:mm:ss.sssZ\n\n` +
          `💡 The endpoint "${lastEndpoint}" is correct - just fix the data format!`;
      }
      // Check for PolicyError (Policy Failed)
      else if (errorMessage.includes('Policy Failed') || errorDetails.includes('PolicyError')) {
        fullErrorMessage += `\n\n🚫 POLICY ERROR DETECTED:\n` +
          `"Policy Failed" means a Strapi policy is blocking your request.\n` +
          `This is different from permissions - it's a custom policy check.\n\n` +
          `Common causes:\n` +
          `1. Custom policy in your Strapi project blocking API requests\n` +
          `2. Content-Type permissions not properly configured\n` +
          `3. API token doesn't have required permissions\n\n` +
          `To fix:\n` +
          `1. Check for custom policies in: src/api/${config.collectionType}/policies/\n` +
          `2. Strapi Admin → Settings → API Tokens → Edit token\n` +
          `   - Set to "Full access" OR enable all permissions for your content type\n` +
          `3. Settings → Users & Permissions → Roles → Public/Authenticated\n` +
          `   - Enable "create" permission for "${config.collectionType}"\n` +
          `4. If you have custom policies, check they allow API token access\n` +
          `5. Try using "Full access" token type for testing\n`;
      }
      // Add specific message for 405 errors
      else if (response?.status === 405) {
        fullErrorMessage += `\n\n⚠️ IMPORTANT: 405 Method Not Allowed means the endpoint exists but POST is not allowed.\n` +
          `This is almost always a PERMISSIONS issue. Both endpoints returned 405, which means:\n` +
          `1. Your API Token likely doesn't have "Create" permission\n` +
          `2. OR the content type permissions are not enabled in Strapi\n\n` +
          `To fix:\n` +
          `1. Go to Strapi Admin → Settings → API Tokens\n` +
          `2. Edit your API token\n` +
          `3. Under "Token type", select "Full access" OR ensure "Create" is checked for your content type\n` +
          `4. Also check: Settings → Users & Permissions Plugin → Roles → Public (or Authenticated)\n` +
          `5. Ensure "create" permission is enabled for "${config.collectionType}" content type`;
      }
      // Add message for 403 errors (general)
      else if (response?.status === 403 && !errorMessage.includes('Policy Failed')) {
        fullErrorMessage += `\n\n🔒 403 Forbidden Error:\n` +
          `This usually means:\n` +
          `1. API Token doesn't have "Create" permission\n` +
          `2. Content type permissions not enabled\n` +
          `3. Custom policy blocking the request\n\n` +
          `To fix:\n` +
          `1. Strapi Admin → Settings → API Tokens → Edit token → Set to "Full access"\n` +
          `2. Settings → Users & Permissions → Roles → Enable "create" for "${config.collectionType}"\n`;
      }
      
      // Show detailed error in UI
      showDetailedError(fullErrorMessage, lastEndpoint, response?.status || 0);
      throw new Error(errorMessage);
    }
    
    const result = await response.json();
    console.log('✅ Success:', result);
    
    showLoading(false);
    // Handle both Strapi v4 and v5 response formats
    const postId = result.data?.id || result.data?.attributes?.id || 'unknown';
    const postTitle = result.data?.attributes?.title || result.data?.title || 'Blog Post';
    showStatus(
      `✅ Blog post created successfully!\nID: ${postId}\nTitle: ${postTitle}`,
      'success'
    );
    
    // Clear form after successful publish
    setTimeout(() => {
      resetForm();
    }, 3000);
    
  } catch (error) {
    console.error('❌ Publishing error:', error);
    showLoading(false);
    showStatus(`❌ Error publishing: ${error.message}`, 'error');
  }
});