# studio ez site: how to edit

The site is plain HTML, CSS and JavaScript. Everything the visitor sees is in the `public` folder.

| I want to...                          | Edit this                                           |
|---------------------------------------|-----------------------------------------------------|
| Add or change a project / photo       | `public/projects.js` + put the image in `public/images/` |
| Change the text on the About page     | `public/about.html`                                 |
| Change email, phone or address        | `public/about.html` (Contact section)               |
| Change colours or fonts               | top of `public/style.css`                           |

## Add a photo to an existing project
1. GitHub, open `public/images`, click Add file, Upload files, drop in the JPG (about 1200px wide, under 400 KB).
2. Open `public/projects.js`, click the pencil, add a line to that project's `images` list:
   `["images/your-file.jpg", "Plain description of the picture"],`
3. Commit changes. The live site updates in about a minute.

## Add a new project
Copy one whole `{ ... }` block in `projects.js`, paste it before the final `]`, put a comma after the block above it, and change the text and file names. It appears on the work page and on the landing page orbit automatically.

## If something breaks
GitHub keeps every version. Open the file, click History, and restore the last good one.

## Start page and landing page
- The start page (the key presses itself, then the site opens) shows once per visit. It is controlled by `public/intro.js`; the timing of the automatic press is the number `1700` (milliseconds) in that file.
- The background texture is `public/images/texture.png`, shown at 2% opacity, tiled at 216px. Change `opacity: .02` in `public/style.css` (the `body::before` and `.site::before` rules) to make it stronger or weaker.

## Previewing on your own computer (no GitHub needed)

Double-click `studio-ez-standalone.html`. It is the whole site in one file (all pages and photos inside it).
The start page plays once per browser tab; open the file in a new tab to see it again.
After you change anything in `public/`, rebuild that file with `python3 tools/build_standalone.py`.
Fonts (Prompt and Press Start 2P) are bundled in `public/fonts/` (open-source licences included), so the site looks the same offline.

## Pages

`index.html` is the landing page, `work.html` the selected work, `about.html` the about page and `contact.html` the contact page with its brief form.
The form opens the visitor's own email app with the message filled in. The site has no server, so nothing is sent by the page itself.
To change the phone number, email or address, edit `contact.html` (and the footer copy in `about.html` if you add it there).

## Tools (in the `tools` folder)

- `python3 tools/make_tiles.py` makes the small `t-` images that orbit on the landing page. Run it after adding a new project cover.
- `python3 tools/tighten_wordmark.py` rebuilds the tighter "studio" wordmark from `tools/original-logo/`. Letter spacing is set in `tools/wordmark.json`.
- `python3 tools/build_standalone.py` builds the single-file preview.
