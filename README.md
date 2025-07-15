# Latent Sculptor

Latent Sculptor is a web-based tool for interactively generating images with generative AI. Inspired by the academic paper "Towards Holistic Prompt Craft," this application provides a novel, node-based user interface for manipulating and combining various parameters to guide the AI image generation process.

Users can add, position, and configure different types of nodes on a canvas—from text prompts to pixel manipulations—to create unique and complex visual outputs.

## Philosophy

The core philosophy of Latent Sculptor is **Holistic Prompt Craft**. Traditional AI image generation often relies on a simple text box, leaving the user to guess at the complex inner workings of the model. This tool is an experiment in a more tactile, intuitive, and holistic approach.

Inspired by the **PromptJ** and **PromptTank** concepts, Latent Sculptor treats every parameter—text, color, noise, diffusion strength—as a tangible element you can directly manipulate. By spatializing these elements on a canvas, you can intuitively understand their relationships and influence on the final image, moving beyond simple text-based prompting to a more expressive, craft-like interaction with the AI.

## Core Concepts

The canvas is your workspace. You can add and manipulate different types of nodes to influence the final image. The vertical position of a node on the canvas determines its overall influence in the final generation step.

### Node Types

- **Text Prompt**: Provides text descriptions to guide the AI. This is the primary way to define the subject and style of the image.
- **Camera Input**: Uses a live feed from your webcam as the initial input image for the pipeline.
- **Noise**: Adds random static to the image, which can create texture and complexity.
- **Brightness**: Adjusts the overall lightness or darkness of the image.
- **Color**: Applies a solid color tint to the image.
- **Canny Edge**: Detects edges in the input and creates a line-drawing effect, useful for structural guidance.
- **Diffusion**: Controls the strength of the AI's creative input. Higher values give the AI more freedom.
- **Seed**: A number that initializes the random generation. Using the same seed with the same prompt will produce similar results.
- **Group**: Combines multiple selected nodes into a single, manageable unit.

## Getting Started (Server-based Development)

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes. This setup uses the Next.js server for secure API calls.

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

## Deployment

This application supports two deployment modes: **server-based** and **static**.

### Server-Based Deployment (Recommended)

This is a Next.js application that uses server-side code to handle AI image generation. This is the most secure and robust way to deploy the app.

**Hosting Providers**

You need a hosting provider that supports Node.js environments. Here are some excellent choices:

-   **Vercel**: The creators of Next.js. Offers a simple git-push-to-deploy workflow and a generous free tier.
-   **Netlify**: Another popular, easy-to-use platform with great support for Next.js.
-   **Firebase App Hosting**: A great choice if you want to stay within the Google Cloud ecosystem.

When deploying to any of these providers, you will need to set the `GOOGLE_API_KEY` as an environment variable in your hosting provider's dashboard.

### Static Deployment (e.g., GitHub Pages)

The application can also be exported as a static site. In this mode, the server-side AI generation is disabled. Instead, users must provide their own Google AI API key in the sidebar to generate images directly from their browser.

1.  **Build the Static Site**
    Run the following command to build the application. This will create a static version in the `out/` directory.
    ```bash
    npm run build
    ```

2.  **Deploy to GitHub Pages**
    - Push your code to a GitHub repository.
    - Go to your repository's **Settings** tab.
    - Navigate to the **Pages** section in the left sidebar.
    - Under "Build and deployment", select the source as **Deploy from a branch**.
    - Choose the `main` (or `master`) branch and the `/out` folder. Save your changes.
    - After a few minutes, your site should be live at the provided GitHub Pages URL.

## Inspiration & Credits

This application is heavily inspired by the principles of "Holistic Prompt Craft" as explored in the academic paper by Joseph Lindley and Roger Whitham. Their work on the PromptJ and PromptTank user interfaces demonstrated novel ways of interacting with generative AI, moving beyond simple text boxes to a more tactile, spatial, and holistic approach.

> **Towards Holistic Prompt Craft**
>
> Joseph Lindley & Roger Whitham, Imagination Lancaster, Lancaster University, UK
>
> https://doi.org/10.1145/3715336.3735414
