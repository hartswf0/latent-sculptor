# Latent Sculptor

Latent Sculptor is a web-based tool for interactively generating images with generative AI. Inspired by the academic paper "Towards Holistic Prompt Craft," this application provides a novel, node-based user interface for manipulating and combining various parameters to guide the AI image generation process.

Users can add, position, and configure different types of nodes on a canvas—from text prompts to pixel manipulations—to create unique and complex visual outputs.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (version 20 or later recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- A [Google AI API Key](https://aistudio.google.com/app/apikey) for generative AI features.

### Installation and Setup

1.  **Clone the repository**
    If you haven't already, clone the repository to your local machine:
    ```bash
    git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
    cd YOUR_REPOSITORY_NAME
    ```

2.  **Create an Environment File**
    The application requires a Google AI API key to function. You'll need to create a local environment file to store this key securely.

    Create a new file in the root of your project named `.env.local`.

3.  **Add Your API Key**
    Open the `.env.local` file and add your Google AI API key as follows:
    ```env
    GOOGLE_API_KEY=YOUR_API_KEY_HERE
    ```
    You can get your free API key from [Google AI Studio](https://aistudio.google.com/app/apikey). The `.gitignore` file is already configured to prevent this file from being committed to GitHub.

4.  **Install Dependencies**
    Install all the required npm packages:
    ```bash
    npm install
    ```

5.  **Run the Development Server**
    Start the Next.js development server:
    ```bash
    npm run dev
    ```
    Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

### Deployment

When deploying your application to a hosting provider (like Vercel, Netlify, or Firebase App Hosting), you will need to set the `GOOGLE_API_KEY` as an environment variable in your hosting provider's dashboard. Do not expose this key in your client-side code.
