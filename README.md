# NestJS Backend

This is the backend for the Gemini/Supabase/n8n integration task. It exposes endpoints to receive form data, process it with Google's Gemini API, store results in Supabase, and trigger an n8n webhook.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Supabase Setup](#supabase-setup)
- [n8n Webhook Setup](#n8n-webhook-setup)
- [API Endpoints](#api-endpoints)
- [Testing the Integration](#testing-the-integration)
- [Common Issues & Troubleshooting](#common-issues--troubleshooting)

## Prerequisites

- Node.js (v18+)
- npm/yarn
- Supabase account
- Google AI Studio API key (for Gemini access)
- n8n instance (for webhook integrations)

## Getting Started

1. Clone the repository
2. Install dependencies:

```bash
cd backend
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```
# Server
PORT=3000

# Gemini API
GEMINI_API_KEY=your_gemini_api_key

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key

# n8n
N8N_WEBHOOK_URL=your_n8n_webhook_url
```

4. Start the development server:

```bash
npm run start:dev
```

## Configuration

Make sure you have valid credentials for:

- Google AI Studio API key (Gemini)
- Supabase project
- n8n webhook endpoint

## Supabase Setup

1. **Create a Supabase Project**:
   - Go to [Supabase]and sign in
   - Click "New Project" and follow the setup wizard
   - Once created, grab your project URL and service role key from Project Settings > API

2. **Create the Database Table**:
   - Navigate to the SQL Editor
   - Run the following SQL to create the table:

```sql
CREATE TABLE openai_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prompt TEXT NOT NULL,
  response TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index for faster queries
CREATE INDEX idx_openai_responses_created_at ON openai_responses (created_at DESC);

## n8n Webhook Setup

1. **Install and Set Up n8n**:
   - Install n8n locally or use their cloud service

2. **Create a New Workflow**:
   - Access the n8n dashboard (default: http://localhost:5678)
   - Create a new workflow
   - Add a "Webhook" node as a trigger
   - Configure it as a "POST" webhook
   - Save the workflow to get the webhook URL
   - Copy this URL into your `.env` file as `N8N_WEBHOOK_URL`


## API Endpoints

### Process Prompt

**Endpoint**: `POST /api/process`

**Request Body**:
```json
{
  "prompt": "Your prompt text here"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "prompt": "Your prompt text here",
    "response": "The generated response from Gemini"
  }
}
```

### Get Responses

**Endpoint**: `GET /api/responses?limit=10&offset=0`

**Query Parameters**:
- `limit` (optional): Number of responses to return (default: 50)
- `offset` (optional): Offset for pagination (default: 0)

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "prompt": "Example prompt",
      "response": "Example response",
      "created_at": "2023-06-03T12:00:00.000Z"
    }
  ],
  "meta": {
    "limit": 10,
    "offset": 0,
    "count": 1
  }
}
```

### Get Response by ID

**Endpoint**: `GET /api/responses/:id`

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "prompt": "Example prompt",
    "response": "Example response",
    "created_at": "2023-06-03T12:00:00.000Z"
  }
}
```

## Testing the Integration

1. **Start the Backend Server**:
   ```bash
   npm run start:dev
   ```

2. **Test the Process Endpoint**:
   ```bash
   curl -X POST http://localhost:3000/api/process \
     -H "Content-Type: application/json" \
     -d '{"prompt": "Tell me a short story about a robot"}'
   ```

3. **Check Supabase**:
   - Go to your Supabase dashboard
   - Navigate to Table Editor > openai_responses
   - Verify the prompt and response were saved

4. **Check n8n Workflow Execution**:
   - Go to your n8n dashboard
   - Check the executions of your workflow
   - Verify the webhook was triggered with the correct data

## Common Issues & Troubleshooting

- **CORS Issues**: If you're experiencing CORS problems, make sure your frontend origin is properly configured
- **API Key Errors**: Double-check your environment variables for correct API keys
- **Database Connection**: Verify your Supabase URL and service role key are correct
- **n8n Webhook**: Ensure the webhook URL is accessible from your server
