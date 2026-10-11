
# Veyzo Web Client

Veyzo Web Client is the user interface for the Veyzo media processing service. Built with React and Vite, this Single Page Application (SPA) provides a modern dashboard for users to manage media uploads, track asynchronous processing statuses, and download generated outputs.

## Technologies
- **Core:** React 18, Vite
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **State & UI:** Custom CSS, React Hot Toast
- **Server:** Nginx

## Core Features
- **Real-Time Status Tracking:** Implements optimized polling to fetch the processing status of background tasks and update the UI dynamically.
- **Global HTTP Interceptor:** Centralizes the handling of 4xx and 5xx responses via Axios interceptors. It automatically manages unauthorized access (401/403), payload size limits (413), and standardizes error formats.
- **Large File Support:** Configured with Nginx's `client_max_body_size` to seamlessly handle high-resolution video uploads.
- **Safe Error Rendering:** Parses raw exception objects returned from the backend and safely renders them as user-friendly toast notifications, completely eliminating UI crashes caused by unhandled error boundaries.

## Installation

### Prerequisites
- Node.js (v18+)

### Development Setup
1. Install dependencies:
   ```bash
   npm install
