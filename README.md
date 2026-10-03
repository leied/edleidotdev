# Edward’s corner of the internet

A fresh implementation of the supplied annotated sketch. Vite + TypeScript, with hand-written CSS and no component framework.

```sh
npm install
npm run dev
```

`npm run build` checks TypeScript and builds the static site into `dist/`. `npm run preview` serves that build locally.

## Make it yours

- Edit `src/content.ts` for personal links, the project description, and the portrait path. Blank URLs open an explicit “coming soon” notice.
- Place your photo in `public/images/`, then set `profile.portrait` to `/images/your-photo.jpg`. The hero uses a full background photo with the subject on the right and an 80% black overlay. Until then, a drawn placeholder occupies the photo area.
- Add the unfinished timeline content in `src/main.ts`. The supplied academic details and project example are retained from the sketch.
- The fonts are Roboto, Archivo Black, and Libre Barcode 39 Extended, served locally from the build.

The clock follows `America/Los_Angeles`, including daylight saving time. Dotted annotations support hover, focus, and taps. The project previews on hover and stays open on click. The cup animation runs once when it enters view, can be replayed, and respects reduced motion. Section hashes are shareable.

The archived design directory is not used by this application.
