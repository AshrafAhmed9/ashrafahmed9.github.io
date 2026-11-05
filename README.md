# Portfolio — K Ashraf Ahmed

Personal portfolio site built with Next.js, TypeScript, Tailwind CSS v4 and React Three Fiber. Deployed to GitHub Pages at [ashrafahmed9.github.io](https://ashrafahmed9.github.io).

The page is a normal scrolling document with a 3D scene behind it: the camera moves to a different showpiece for each section, and the scene highlights whichever project, PR or skill group is being read. All content comes from `src/data/`.

The previous 2D version of the site lives on the `classic-site` branch.

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production Build

```bash
npm run build
```

Static output is generated in `./out`.

## Deployment

Pushing to `main` triggers the GitHub Actions workflow which builds and deploys to GitHub Pages automatically.
