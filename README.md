# Edward’s corner of the internet

A fresh implementation of the supplied annotated sketch. Vite + TypeScript, with hand-written CSS and no component framework.

```sh
npm install
npm run dev
```

`npm run build` checks TypeScript and builds the static site into `dist/`. `npm run preview` serves that build locally.

## Make it yours

- Edit `src/content.ts` for personal links, featured and other project summaries, broad skills, and the portrait path. Blank personal URLs open an explicit “coming soon” notice. Project `links` contain verified public destinations; `privateSource` labels repositories that visitors cannot access.
- Place your photo in `public/images/`, then set `profile.portrait` to `/images/your-photo.jpg`. The hero uses a full background photo with the subject on the right and an 80% black overlay. Until then, a drawn placeholder occupies the photo area.
- Edit the introduction and short About notes in `src/main.ts`. Keep the public bio focused on interests; leave organization history, dates, detailed school history, and private contact information off the page and out of hover text.
- The fonts are Roboto, Archivo Black, and Libre Barcode 39 Extended, served locally from the build.

The clock follows `America/Los_Angeles`, including daylight saving time. Dotted annotations support hover, focus, and taps. The uninterrupted barcode separators repeat “Construction in progress...” in Libre Barcode 39 Extended. Embedidraw previews on hover and stays open on click. Résumé project cards use native expandable disclosures for mouse, touch, and keyboard access. The cup animation runs once when it enters view, then settles into a static illustration. Replay runs it again; reduced motion keeps the static cup without playing the animation. Section hashes are shareable.

The archived design directory is not used by this application.
