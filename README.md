# Portfolio Site

Static site, no build step. Open `index.html` through a local web server (the
nav bar is fetched at runtime, so `file://` will not work — e.g. `python -m
http.server` in this folder).

## Layout

```
index.html            home / about + project list
trekz.html            project case studies
lindsay.html
recompiled.html
mee.html              placeholder pages for unfinished projects
website.html
videography.html      showreel
beyond.html           hobbies / non-CS interests
contact.html

css/base.css          colours, reset, nav bar, pixel divider — loaded everywhere
css/project.css       project case-study layout + gallery + lightbox
css/home.css          home page only
css/videography.css   showreel only
css/beyond.css        hobbies page only
css/contact.css       contact page only
css/wip.css           placeholder pages

js/nav.js             injects partials/nav.html into every page
js/gallery.js         builds the gallery grid + lightbox from page data
js/home.js            builds the project list + hero carousel
js/videography.js     builds the showreel from page data
js/beyond.js          builds the hobbies explorer from page data

partials/nav.html             the nav bar markup — edit links here, once
partials/project-template.html starter for a new project page

assets/               images and video, one folder per project
```

Every page loads `css/base.css` first, then its own sheet. Behaviour lives in
`js/`; **content lives in a `<script>` block at the bottom of each page**, as a
plain array you can edit without touching any markup.

## Common edits

**Change a colour, font or the nav bar**
`css/base.css` (`:root` block) and `partials/nav.html`. Both apply to every page.

**Add a project**
1. Copy `partials/project-template.html` to `<project>.html` in the root.
2. Fill in the header, the write-up, and the `galleryItems` array at the bottom.
3. Add an entry to the `projects` array at the bottom of `index.html`.
4. Drop images in `assets/<project>/` and an icon in
   `assets/homepage/projecticons/`.

**Add a screenshot or clip to a project**
Add one object to that page's `galleryItems` array. Supported media types:
`image`, `video` (local mp4), `youtube`, `embed` (any iframe, e.g. blueprintUE).
The field reference is at the top of `js/gallery.js`.

**Add a video to the showreel**
Add one object to `videoSections` at the bottom of `videography.html`. The
thumbnail defaults to the YouTube still; set `thumb` to override it.

**Add a hobby or photo to Beyond**
Add a section or a card to `beyondSections` at the bottom of `beyond.html`.

## To do

- `assets/homepage/projecticons/mee.png` is referenced by the Mee card but does
  not exist yet
- Add resume + real content for the WIP pages (Mee, this site)
- Photography page
- Browser tab icon (favicon)
- Maybe sound effects
