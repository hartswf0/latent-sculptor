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

### Static Deployment (GitHub Pages)

The application can also be exported as a static site. In this mode, the server-side AI generation is disabled. Instead, users must provide their own Google AI API key in the sidebar to generate images directly from their browser.

**The Easy Way: Using the GitHub Action**

This repository is already configured with a GitHub Action that will automatically build and deploy your site to GitHub Pages whenever you push to the `main` branch.

1.  **Push Your Code**: Simply commit and push your changes to the `main` branch of your GitHub repository.
    ```bash
    git push origin main
    ```
2.  **Enable GitHub Pages**: In your GitHub repository, go to **Settings > Pages**. Under "Build and deployment", select the source as **GitHub Actions**. This is usually the default.
3.  **Wait for Deployment**: Go to the **Actions** tab in your repository. You will see the `deploy` workflow running. Once it's complete, your site will be live at the URL provided on the Pages settings screen (e.g., `https://<your-username>.github.io/latent-sculptor/`).

**The Manual Way**

If you prefer to build the site locally:

1.  **Install and Build**:
    ```bash
    npm install
    npm run build
    ```
    This creates an `out` folder with all the static files.
2.  **Deploy**: Deploy the contents of the `out` folder to your static hosting provider.

## Inspiration & Credits

This application is heavily inspired by the principles of "Holistic Prompt Craft" as explored in the academic paper by Joseph Lindley and Roger Whitham. Their work on the PromptJ and PromptTank user interfaces demonstrated novel ways of interacting with generative AI, moving beyond simple text boxes to a more tactile, spatial, and holistic approach.

> **Towards Holistic Prompt Craft**
>
> Joseph Lindley & Roger Whitham, Imagination Lancaster, Lancaster University, UK
>
> https://doi.org/10.1145/3715336.3735414
