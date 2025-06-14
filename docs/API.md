# CVGenius API Documentation

## Base URL
- **Development**: `http://localhost:8000`
- **Production**: `https://cvgenius-backend-449239631634.europe-west1.run.app`

## Authentication
No authentication required. All endpoints are public with rate limiting (15 requests/hour per IP).

## Rate Limiting
- **Limit**: 15 requests per hour per IP address
- **Headers**: Rate limit information included in response headers

## Endpoints

### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-14T12:00:00Z",
  "version": "1.0.0"
}
```

### System Health
```http
GET /api/v1/system/health
```

**Response:**
```json
{
  "status": "healthy",
  "checks": {
    "database": "healthy",
    "external_apis": "healthy"
  },
  "timestamp": "2025-01-14T12:00:00Z"
}
```

## CV Operations

### 1. Generate CV from Form Data (Creator Flow)
```http
POST /api/v1/generate-from-form
```

**Request Body:**
```json
{
  "personal_details": {
    "full_name": "John Doe",
    "email": "john@example.com",
    "phone": "+353 1 234 5678",
    "linkedin_url": "linkedin.com/in/johndoe",
    "location": "Dublin, Ireland"
  },
  "work_experience": [
    {
      "job_title": "Software Engineer",
      "company": "Tech Corp",
      "duration": "2020-2023",
      "responsibilities": ["Developed web applications", "Led team projects"]
    }
  ],
  "education": [
    {
      "degree": "Computer Science",
      "institution": "Trinity College Dublin",
      "year": "2020"
    }
  ],
  "skills": "Python, JavaScript, React",
  "job_description": "Full stack developer position...",
  "theme": "classic"
}
```

**Response:**
```json
{
  "cv_pdf_base64": "base64_encoded_pdf_content",
  "cover_letter_pdf_base64": "base64_encoded_cover_letter_content",
  "filename_cv": "cv_20250114_120000.pdf",
  "filename_cover_letter": "cover_letter_20250114_120000.pdf",
  "generation_timestamp": "2025-01-14T12:00:00Z",
  "cv_data": {
    "personal_details": {...},
    "work_experience": [...],
    "education": [...],
    "skills": {...},
    "cover_letter_body": "Cover letter content...",
    "company_name": "Target Company",
    "job_title": "Target Position"
  }
}
```

### 2. Generate CV from Upload (Updater Flow)
```http
POST /api/v1/generate-from-upload
```

**Request Body (multipart/form-data):**
- `file`: CV file (PDF, DOCX, DOC, TXT)
- `job_description`: Job description text
- `theme`: Cover letter theme (classic, modern, academic)

**Response:**
```json
{
  "cv_pdf_base64": "base64_encoded_pdf_content",
  "cover_letter_pdf_base64": "base64_encoded_cover_letter_content",
  "filename_cv": "updated_cv_20250114_120000.pdf",
  "filename_cover_letter": "cover_letter_20250114_120000.pdf",
  "generation_timestamp": "2025-01-14T12:00:00Z",
  "cv_data": {
    "personal_details": {...},
    "work_experience": [...],
    "education": [...],
    "skills": {...},
    "cover_letter_body": "Cover letter content...",
    "company_name": "Target Company",
    "job_title": "Target Position"
  }
}
```

## Cover Letter Themes

### Available Themes:
1. **classic**: Traditional professional format
2. **modern**: Contemporary design with color accents
3. **academic**: Formal academic style

## File Upload Specifications

### Supported File Types:
- **PDF**: `.pdf`
- **Word Documents**: `.docx`, `.doc`
- **Text Files**: `.txt`

### File Size Limits:
- Maximum file size: 10MB
- Recommended: Under 5MB for faster processing

## Error Responses

### Rate Limit Exceeded (429)
```json
{
  "detail": "Rate limit exceeded. Try again later."
}
```

### Validation Error (422)
```json
{
  "detail": [
    {
      "loc": ["body", "personal_details", "email"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

### File Processing Error (400)
```json
{
  "detail": "File format not supported or corrupted"
}
```

### AI Service Error (500)
```json
{
  "detail": "AI service temporarily unavailable. Please try again."
}
```

## Response Headers

All API responses include:
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Remaining requests in current window
- `X-RateLimit-Reset`: Time when rate limit resets

## Dublin/Ireland Optimizations

The API is specifically optimized for:
- **Irish phone number formatting**: +353 format
- **Dublin addresses**: Proper formatting for Irish addresses
- **EU work authorization**: Automatic detection and inclusion
- **ATS compatibility**: Optimized for Irish/European ATS systems
- **Local companies**: Recognition of major Dublin employers
- **Irish English**: Proper spelling and terminology

## AI Features

### Content Enhancement:
- **Skills optimization** based on job description
- **Achievement quantification** where possible
- **Keyword optimization** for ATS systems
- **Cliché removal** from cover letters
- **Grammar checking** and improvement

### Dublin-Specific Enhancements:
- **Company research** for known Dublin employers
- **Industry context** for Irish job market
- **Cultural adaptation** for Irish business practices
- **Local terminology** and preferences

## Development Notes

### Testing Endpoints:
Use the interactive API documentation at:
- Development: `http://localhost:8000/docs`
- Production: `https://cvgenius-backend-449239631634.europe-west1.run.app/docs`

### CORS Configuration:
The API accepts requests from:
- `http://localhost:3000` (development)
- `https://cvgenius-nine.vercel.app` (production)

### Performance:
- Average response time: 15-30 seconds
- PDF generation: WeasyPrint with A4 optimization
- AI processing: Google Gemini 2.0 Flash