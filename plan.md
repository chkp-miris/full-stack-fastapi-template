# Implementation Plan

This plan was automatically generated from the Software Design Document.

## Features

### Provide a drag‑and‑drop CSV upload interface un...

**Description**: Provide a drag‑and‑drop CSV upload interface under a new **Import** route.
**Source**: ***Global Overview***

### Parse uploaded CSV files server‑side using *pan...

**Description**: Parse uploaded CSV files server‑side using *pandas* with type inference and streaming for large files.
**Source**: ***Global Overview***

### Return preview data, column metadata, and basic...

**Description**: Return preview data, column metadata, and basic statistics in JSON format.
**Source**: ***Global Overview***

### Auto‑generate chart data (histograms, bar chart...

**Description**: Auto‑generate chart data (histograms, bar charts, line charts) based on column types and user selections.
**Source**: ***Global Overview***

### Allow bulk‑saving of rows to the existing `item...

**Description**: Allow bulk‑saving of rows to the existing `items` API (optional).
**Priority**: low
**Source**: ***Global Overview***

### Enforce file‑size, mime‑type, and rate‑limit co...

**Description**: Enforce file‑size, mime‑type, and rate‑limit constraints to protect the service.
**Source**: ***Global Overview***

### Require **no database migrations**, **no WebSoc...

**Description**: Require **no database migrations**, **no WebSocket connections**, and **no new tables**.
**Source**: ***Global Overview***

### `POST /upload/csv` – receive a CSV file, return...

**Description**: `POST /upload/csv` – receive a CSV file, return `upload_id`, headers, sampleRows, inferredTypes, basicStats.
**Source**: ***Global Overview***

### `POST /upload/insights` – given `upload_id` and...

**Description**: `POST /upload/insights` – given `upload_id` and chart selections, compute and return chart‑ready series data.
**Source**: ***Global Overview***

### `POST /upload/save` – bulk‑insert selected rows...

**Description**: `POST /upload/save` – bulk‑insert selected rows into `/items/` using the existing CRUD path.
**Source**: ***Global Overview***

### `CsvImportPage` – top‑level route `/import` wit...

**Description**: `CsvImportPage` – top‑level route `/import` with authentication guard.
**Source**: ***Global Overview***

### `CsvDropzone` – drag‑and‑drop area using *react...

**Description**: `CsvDropzone` – drag‑and‑drop area using *react‑dropzone*.
**Source**: ***Global Overview***

### `CsvPreviewTable` – first 100 rows rendered via...

**Description**: `CsvPreviewTable` – first 100 rows rendered via *React Table*.
**Source**: ***Global Overview***

### `InsightsCards` – KPI cards (row count, column ...

**Description**: `InsightsCards` – KPI cards (row count, column count, missing %, etc.).
**Source**: ***Global Overview***

### `QuickChartPanel` – dynamic chart renderer with...

**Description**: `QuickChartPanel` – dynamic chart renderer with *Recharts* and chart selector controls.
**Source**: ***Global Overview***

### `SaveToggle` – checkbox + action button to pers...

**Description**: `SaveToggle` – checkbox + action button to persist data to Items.
**Source**: ***Global Overview***

### Implement scalable architecture for Architect

**Description**: Address the need for a scalable and robust system architecture defined by the System Architect to ensure long-term system performance and reliability.
**Priority**: high
**Stakeholder**: System Architect
**Source**: Stakeholders

### Develop user-centric features for Product Manager

**Description**: Address the need for user-centric features defined by the Product Manager to ensure enhanced user satisfaction and market competitiveness.
**Priority**: medium
**Stakeholder**: Product Manager
**Source**: Stakeholders

### Optimize codebase for Lead Developer

**Description**: Address the need for an optimized and maintainable codebase defined by the Lead Full-Stack Developer to ensure efficient development and reduced technical debt.
**Priority**: medium
**Stakeholder**: Lead Full-Stack Developer
**Source**: Stakeholders

### Enhance testing automation for QA Engineer

**Description**: Address the need for enhanced testing automation defined by the QA Engineer to ensure higher test coverage and faster release cycles.
**Priority**: low
**Stakeholder**: QA Engineer
**Source**: Stakeholders

## Implementation Tasks

### Task Breakdown

#### High Priority Tasks

**Implement SaveToggle UI Component**
- Description: Develop the SaveToggle component which includes a checkbox and a button for bulk saving items. Ensure that a success toast message is displayed upon successful save.
- Source: Key UI Components

**Implement uploadCsv function**
- Description: Develop the uploadCsv function to handle CSV file uploads and return a Promise of PreviewResponse.
- Source: Frontend Service Integration

**Add new router to api_v1**
- Description: Integrate a new router into the api_v1 backend, including new services and middleware.
- Source: Deployment Strategy

**Add /import route and components to frontend**
- Description: Develop and integrate the /import route and its components into the frontend application, and register the service layer.
- Source: Deployment Strategy

**Unit tests for UploadService.load_csv()**
- Description: Develop unit tests for the UploadService.load_csv() function to ensure type inference and stats accuracy are correct.
- Source: Backend

**API tests for CSV upload and insights generation**
- Description: Create API tests to verify the functionality of uploading small and large CSV files, generating insights, and the save flow.
- Source: Backend

#### Medium Priority Tasks

**Implement getInsights function**
- Description: Create the getInsights function to retrieve insights based on uploadId and config, returning a Promise of ChartResponse.
- Source: Frontend Service Integration

**Implement saveRows function**
- Description: Develop the saveRows function to save rows using the provided uploadId.
- Source: Frontend Service Integration

**Expose environment variables**
- Description: Expose the environment variables UPLOAD_MAX_MB and UPLOAD_TTL_SEC with default values.
- Source: Deployment Strategy

**Update OpenAPI documentation**
- Description: Update the OpenAPI documentation to include the new endpoints.
- Source: Deployment Strategy

**Jest tests for frontend component rendering**
- Description: Implement Jest tests to ensure frontend components render correctly with mock data.
- Source: Frontend

**Cypress E2E tests for frontend interactions**
- Description: Develop Cypress end-to-end tests to validate drag-and-drop functionality, preview display, and saving rows on the frontend.
- Source: Frontend

## MACHINE_READABLE_OUTLINE

```json
{
  "files": [
    {
      "path": "backend/app/api/api_v1/endpoints/csv_upload.py",
      "type": "fastapi-endpoint",
      "description": "API endpoints for CSV upload and processing"
    },
    {
      "path": "backend/app/services/csv_service.py",
      "type": "service-class",
      "description": "CSV processing service with pandas integration"
    },
    {
      "path": "backend/app/services/insights_service.py",
      "type": "service-class",
      "description": "Data insights and statistics generation service"
    },
    {
      "path": "frontend/src/pages/ImportPage.tsx",
      "type": "react-component",
      "description": "Main CSV import page with authentication guard"
    },
    {
      "path": "frontend/src/components/CsvDropzone.tsx",
      "type": "react-component",
      "description": "Drag-and-drop CSV upload component using react-dropzone"
    },
    {
      "path": "frontend/src/components/CsvPreviewTable.tsx",
      "type": "react-component",
      "description": "CSV data preview table using React Table"
    },
    {
      "path": "frontend/src/components/InsightsCards.tsx",
      "type": "react-component",
      "description": "KPI cards displaying data statistics"
    },
    {
      "path": "frontend/src/components/QuickChartPanel.tsx",
      "type": "react-component",
      "description": "Dynamic chart renderer with Recharts integration"
    },
    {
      "path": "tests/test_csv_upload.py",
      "type": "pytest-test",
      "description": "Backend tests for CSV upload functionality"
    },
    {
      "path": "tests/test_csv_components.spec.ts",
      "type": "playwright-e2e",
      "description": "End-to-end tests for CSV upload workflow"
    }
  ]
}
```

## MACHINE_READABLE_SPEC

```json
{
  "spec": {
    "backend/app/api/api_v1/endpoints/csv_upload.py": {
      "description": "API endpoints for CSV upload and processing",
      "type": "fastapi-endpoint",
      "requirements": [
        "Handle CSV file upload with validation",
        "Parse CSV files using pandas with proper error handling",
        "Return file metadata and preview data",
        "Implement file size and type restrictions",
        "Handle CSV file upload with validation",
        "Parse CSV files using pandas with proper error handling",
        "Return file metadata and preview data",
        "Implement file size and type restrictions",
        "Handle CSV file upload with validation",
        "Parse CSV files using pandas with proper error handling",
        "Return file metadata and preview data",
        "Implement file size and type restrictions",
        "Handle CSV file upload with validation",
        "Parse CSV files using pandas with proper error handling",
        "Return file metadata and preview data",
        "Implement file size and type restrictions",
        "Handle CSV file upload with validation",
        "Parse CSV files using pandas with proper error handling",
        "Return file metadata and preview data",
        "Implement file size and type restrictions",
        "Handle CSV file upload with validation",
        "Parse CSV files using pandas with proper error handling",
        "Return file metadata and preview data",
        "Implement file size and type restrictions",
        "Handle CSV file upload with validation",
        "Parse CSV files using pandas with proper error handling",
        "Return file metadata and preview data",
        "Implement file size and type restrictions",
        "Handle CSV file upload with validation",
        "Parse CSV files using pandas with proper error handling",
        "Return file metadata and preview data",
        "Implement file size and type restrictions",
        "Implement implement savetoggle ui component",
        "Implement implement uploadcsv function",
        "Implement implement getinsights function",
        "Implement implement saverows function",
        "Implement add new router to api_v1",
        "Implement add /import route and components to frontend"
      ],
      "dependencies": [
        "fastapi",
        "pydantic",
        "sqlalchemy",
        "pandas",
        "io"
      ],
      "implementation_notes": [
        "Use pandas.read_csv() with chunking for large files",
        "Implement proper error handling for malformed CSV files",
        "Return upload_id for subsequent operations",
        "Validate file size and MIME type before processing",
        "Implement drag-and-drop functionality using react-dropzone",
        "Calculate and display descriptive statistics",
        "Implement drag-and-drop functionality using react-dropzone",
        "Allow optional saving of data to existing Item table"
      ],
      "framework": "fastapi",
      "python_version": "3.9+"
    },
    "backend/app/services/csv_service.py": {
      "description": "CSV processing service with pandas integration",
      "type": "service-class",
      "requirements": [
        "Implement business logic",
        "Add proper error handling",
        "Include unit tests"
      ],
      "dependencies": [
        "pydantic",
        "sqlalchemy",
        "pandas",
        "io"
      ],
      "implementation_notes": [
        "Implement drag-and-drop functionality using react-dropzone",
        "Calculate and display descriptive statistics",
        "Implement drag-and-drop functionality using react-dropzone",
        "Allow optional saving of data to existing Item table"
      ]
    },
    "backend/app/services/insights_service.py": {
      "description": "Data insights and statistics generation service",
      "type": "service-class",
      "requirements": [
        "Generate charts based on data types",
        "Implement histogram, bar, and line charts",
        "Allow user to select chart types and columns",
        "Generate charts based on data types",
        "Implement histogram, bar, and line charts",
        "Allow user to select chart types and columns",
        "Generate charts based on data types",
        "Implement histogram, bar, and line charts",
        "Allow user to select chart types and columns",
        "Generate charts based on data types",
        "Implement histogram, bar, and line charts",
        "Allow user to select chart types and columns",
        "Generate charts based on data types",
        "Implement histogram, bar, and line charts",
        "Allow user to select chart types and columns",
        "Generate charts based on data types",
        "Implement histogram, bar, and line charts",
        "Allow user to select chart types and columns",
        "Generate charts based on data types",
        "Implement histogram, bar, and line charts",
        "Allow user to select chart types and columns",
        "Generate charts based on data types",
        "Implement histogram, bar, and line charts",
        "Allow user to select chart types and columns"
      ],
      "dependencies": [
        "pydantic",
        "sqlalchemy"
      ],
      "implementation_notes": [
        "Implement drag-and-drop functionality using react-dropzone",
        "Calculate and display descriptive statistics",
        "Implement drag-and-drop functionality using react-dropzone",
        "Allow optional saving of data to existing Item table"
      ]
    },
    "frontend/src/pages/ImportPage.tsx": {
      "description": "Main CSV import page with authentication guard",
      "type": "react-component",
      "requirements": [
        "Create UI component for implement savetoggle ui component",
        "Create UI component for implement uploadcsv function",
        "Create UI component for implement getinsights function",
        "Create UI component for implement saverows function",
        "Create UI component for add new router to api_v1",
        "Create UI component for add /import route and components to frontend"
      ],
      "dependencies": [
        "react",
        "@types/react"
      ],
      "implementation_notes": [
        "Implement drag-and-drop functionality using react-dropzone",
        "Calculate and display descriptive statistics",
        "Implement drag-and-drop functionality using react-dropzone",
        "Allow optional saving of data to existing Item table"
      ],
      "framework": "react",
      "typescript": true
    },
    "frontend/src/components/CsvDropzone.tsx": {
      "description": "Drag-and-drop CSV upload component using react-dropzone",
      "type": "react-component",
      "requirements": [
        "Create UI component for implement savetoggle ui component",
        "Create UI component for implement uploadcsv function",
        "Create UI component for implement getinsights function",
        "Create UI component for implement saverows function",
        "Create UI component for add new router to api_v1",
        "Create UI component for add /import route and components to frontend"
      ],
      "dependencies": [
        "react",
        "@types/react",
        "react-dropzone",
        "recharts",
        "@tanstack/react-table"
      ],
      "implementation_notes": [
        "Implement drag-and-drop functionality using react-dropzone",
        "Calculate and display descriptive statistics",
        "Implement drag-and-drop functionality using react-dropzone",
        "Allow optional saving of data to existing Item table"
      ],
      "framework": "react",
      "typescript": true
    },
    "frontend/src/components/CsvPreviewTable.tsx": {
      "description": "CSV data preview table using React Table",
      "type": "react-component",
      "requirements": [
        "Display CSV data in tabular format",
        "Handle large datasets with pagination",
        "Show column headers and data types",
        "Display CSV data in tabular format",
        "Handle large datasets with pagination",
        "Show column headers and data types",
        "Display CSV data in tabular format",
        "Handle large datasets with pagination",
        "Show column headers and data types",
        "Display CSV data in tabular format",
        "Handle large datasets with pagination",
        "Show column headers and data types",
        "Display CSV data in tabular format",
        "Handle large datasets with pagination",
        "Show column headers and data types",
        "Display CSV data in tabular format",
        "Handle large datasets with pagination",
        "Show column headers and data types",
        "Display CSV data in tabular format",
        "Handle large datasets with pagination",
        "Show column headers and data types",
        "Display CSV data in tabular format",
        "Handle large datasets with pagination",
        "Show column headers and data types",
        "Create UI component for implement savetoggle ui component",
        "Create UI component for implement uploadcsv function",
        "Create UI component for implement getinsights function",
        "Create UI component for implement saverows function",
        "Create UI component for add new router to api_v1",
        "Create UI component for add /import route and components to frontend"
      ],
      "dependencies": [
        "react",
        "@types/react",
        "react-dropzone",
        "recharts",
        "@tanstack/react-table"
      ],
      "implementation_notes": [
        "Show first 100 rows by default",
        "Implement virtual scrolling for performance",
        "Display column types and missing value counts",
        "Implement drag-and-drop functionality using react-dropzone",
        "Calculate and display descriptive statistics",
        "Implement drag-and-drop functionality using react-dropzone",
        "Allow optional saving of data to existing Item table"
      ],
      "framework": "react",
      "typescript": true
    },
    "frontend/src/components/InsightsCards.tsx": {
      "description": "KPI cards displaying data statistics",
      "type": "react-component",
      "requirements": [
        "Generate charts based on data types",
        "Implement histogram, bar, and line charts",
        "Allow user to select chart types and columns",
        "Generate charts based on data types",
        "Implement histogram, bar, and line charts",
        "Allow user to select chart types and columns",
        "Generate charts based on data types",
        "Implement histogram, bar, and line charts",
        "Allow user to select chart types and columns",
        "Generate charts based on data types",
        "Implement histogram, bar, and line charts",
        "Allow user to select chart types and columns",
        "Generate charts based on data types",
        "Implement histogram, bar, and line charts",
        "Allow user to select chart types and columns",
        "Generate charts based on data types",
        "Implement histogram, bar, and line charts",
        "Allow user to select chart types and columns",
        "Generate charts based on data types",
        "Implement histogram, bar, and line charts",
        "Allow user to select chart types and columns",
        "Generate charts based on data types",
        "Implement histogram, bar, and line charts",
        "Allow user to select chart types and columns",
        "Create UI component for implement savetoggle ui component",
        "Create UI component for implement uploadcsv function",
        "Create UI component for implement getinsights function",
        "Create UI component for implement saverows function",
        "Create UI component for add new router to api_v1",
        "Create UI component for add /import route and components to frontend"
      ],
      "dependencies": [
        "react",
        "@types/react"
      ],
      "implementation_notes": [
        "Implement drag-and-drop functionality using react-dropzone",
        "Calculate and display descriptive statistics",
        "Implement drag-and-drop functionality using react-dropzone",
        "Allow optional saving of data to existing Item table"
      ],
      "framework": "react",
      "typescript": true
    },
    "frontend/src/components/QuickChartPanel.tsx": {
      "description": "Dynamic chart renderer with Recharts integration",
      "type": "react-component",
      "requirements": [
        "Generate charts based on data types",
        "Implement histogram, bar, and line charts",
        "Allow user to select chart types and columns",
        "Generate charts based on data types",
        "Implement histogram, bar, and line charts",
        "Allow user to select chart types and columns",
        "Generate charts based on data types",
        "Implement histogram, bar, and line charts",
        "Allow user to select chart types and columns",
        "Generate charts based on data types",
        "Implement histogram, bar, and line charts",
        "Allow user to select chart types and columns",
        "Generate charts based on data types",
        "Implement histogram, bar, and line charts",
        "Allow user to select chart types and columns",
        "Generate charts based on data types",
        "Implement histogram, bar, and line charts",
        "Allow user to select chart types and columns",
        "Generate charts based on data types",
        "Implement histogram, bar, and line charts",
        "Allow user to select chart types and columns",
        "Generate charts based on data types",
        "Implement histogram, bar, and line charts",
        "Allow user to select chart types and columns",
        "Create UI component for implement savetoggle ui component",
        "Create UI component for implement uploadcsv function",
        "Create UI component for implement getinsights function",
        "Create UI component for implement saverows function",
        "Create UI component for add new router to api_v1",
        "Create UI component for add /import route and components to frontend"
      ],
      "dependencies": [
        "react",
        "@types/react"
      ],
      "implementation_notes": [
        "Implement drag-and-drop functionality using react-dropzone",
        "Calculate and display descriptive statistics",
        "Implement drag-and-drop functionality using react-dropzone",
        "Allow optional saving of data to existing Item table"
      ],
      "framework": "react",
      "typescript": true
    },
    "tests/test_csv_upload.py": {
      "description": "Backend tests for CSV upload functionality",
      "type": "pytest-test",
      "requirements": [
        "Handle CSV file upload with validation",
        "Parse CSV files using pandas with proper error handling",
        "Return file metadata and preview data",
        "Implement file size and type restrictions",
        "Handle CSV file upload with validation",
        "Parse CSV files using pandas with proper error handling",
        "Return file metadata and preview data",
        "Implement file size and type restrictions",
        "Handle CSV file upload with validation",
        "Parse CSV files using pandas with proper error handling",
        "Return file metadata and preview data",
        "Implement file size and type restrictions",
        "Handle CSV file upload with validation",
        "Parse CSV files using pandas with proper error handling",
        "Return file metadata and preview data",
        "Implement file size and type restrictions",
        "Handle CSV file upload with validation",
        "Parse CSV files using pandas with proper error handling",
        "Return file metadata and preview data",
        "Implement file size and type restrictions",
        "Handle CSV file upload with validation",
        "Parse CSV files using pandas with proper error handling",
        "Return file metadata and preview data",
        "Implement file size and type restrictions",
        "Handle CSV file upload with validation",
        "Parse CSV files using pandas with proper error handling",
        "Return file metadata and preview data",
        "Implement file size and type restrictions",
        "Handle CSV file upload with validation",
        "Parse CSV files using pandas with proper error handling",
        "Return file metadata and preview data",
        "Implement file size and type restrictions"
      ],
      "dependencies": [
        "pytest",
        "httpx"
      ],
      "implementation_notes": [
        "Use pandas.read_csv() with chunking for large files",
        "Implement proper error handling for malformed CSV files",
        "Return upload_id for subsequent operations",
        "Validate file size and MIME type before processing",
        "Implement drag-and-drop functionality using react-dropzone",
        "Calculate and display descriptive statistics",
        "Implement drag-and-drop functionality using react-dropzone",
        "Allow optional saving of data to existing Item table"
      ]
    },
    "tests/test_csv_components.spec.ts": {
      "description": "End-to-end tests for CSV upload workflow",
      "type": "playwright-e2e",
      "requirements": [],
      "dependencies": [
        "@playwright/test"
      ],
      "implementation_notes": [
        "Implement drag-and-drop functionality using react-dropzone",
        "Calculate and display descriptive statistics",
        "Implement drag-and-drop functionality using react-dropzone",
        "Allow optional saving of data to existing Item table"
      ]
    }
  }
}
```

## Original SDD Reference

This plan was generated from the following Software Design Document:

```
# SDD | CSV Quick‑Insights Uploader

## ***Stakeholders***

| **Stakeholder** | **Name**                  |
| --------------- | ------------------------- |
| Architect       | System Architect          |
| Product         | Product Manager           |
| Lead Developer  | Lead Full‑Stack Developer |
| QA              | QA Engineer               |

## ***Links***

* [pandas Documentation](https://pandas.pydata.org/docs/)
* [FastAPI File Uploads](https://fastapi.tiangolo.com/tutorial/request-files/)
* [react‑dropzone](https://react-dropzone.js.org/)
* [React Table](https://tanstack.com/table)
* [Recharts Documentation](https://recharts.org/)

## ***Introduction***

The **CSV Quick‑Insights Uploader** feature allows authenticated users to import ad‑hoc CSV files into the system, receive an immediate preview of the data, auto‑generated descriptive statistics, and ready‑made charts—without defining new database schemas or using external BI tools. Users may optionally persist the uploaded row...
```