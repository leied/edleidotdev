# Edward’s corner of the internet

A fresh implementation of the supplied annotated sketch. Vite + TypeScript, with hand-written CSS and no component framework.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Use Node.js 22.12 or newer and pnpm 11.26.0. `pnpm build` checks TypeScript and builds the static site into `dist/`. `pnpm preview` serves that build locally.

## Deploy to Cloudflare

```sh
pnpm exec wrangler login   # Once per machine, if not already signed in.
pnpm exec wrangler whoami  # Check the destination account.
pnpm run deploy:check      # Build and validate without publishing.
pnpm run deploy
```

Use `pnpm run deploy`: plain `pnpm deploy` is pnpm’s built-in workspace packaging command, which takes precedence over package scripts. See [pnpm’s script aliases](https://pnpm.io/cli/run).

Wrangler runs a fresh production build and uploads only `dist/` to the `edleidotdev` Worker. Cloudflare serves the static assets directly; there is no server code or database to configure. The command prints the deployed `workers.dev` URL. GitHub pushes save the source; deployments are manual.

To use `edlei.dev`, add this top-level field to `wrangler.jsonc` and deploy again after checking the domain’s existing Cloudflare routing:

```json
"routes": [{ "pattern": "edlei.dev", "custom_domain": true }]
```

Reference: [Cloudflare static assets](https://developers.cloudflare.com/workers/static-assets/get-started/) and [custom domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/).

## Make it yours

- Edit `src/content.ts` for personal links, featured and other project summaries, broad skills, and the portrait path. Blank personal URLs open an explicit “coming soon” notice. Project `links` contain verified public destinations; `privateSource` labels repositories that visitors cannot access.
- Place your photo in `public/images/`, then set `profile.portrait` to `/images/your-photo.jpg`. The hero uses a full background photo with the subject on the right and an 80% black overlay. Until then, a drawn placeholder occupies the photo area.
- Edit the introduction and short About notes in `src/main.ts`. Keep the public bio focused on interests; leave organization history, dates, detailed school history, and private contact information off the page and out of hover text.
- The fonts are Roboto, Archivo Black, and Libre Barcode 39 Extended, served locally from the build.

The clock follows `America/Los_Angeles`, including daylight saving time. Dotted annotations support hover, focus, and taps. The uninterrupted barcode separators repeat “Construction in progress...” in Libre Barcode 39 Extended. Every featured project previews on hover or keyboard focus, stays open on click or tap, and closes on a second click or Escape. Closed details are hidden from keyboard navigation and assistive technology. The cup animation runs once when it enters view, then settles into a static illustration. Replay runs it again; reduced motion keeps the static cup without playing the animation. Section and project hashes are shareable.

The archived design directory is not used by this application.
