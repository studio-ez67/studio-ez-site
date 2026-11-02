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

## The wheel on the landing page
- You can spin it by dragging (mouse or finger); let go and it coasts, then drifts again on its own. The cursor on a card still stops it. All of this is in `public/orbit.js`.
- Card size: `--tw` in the `.stage` rule of `public/style.css` (the width) and `BASE` in `public/orbit.js` (the scale). Bigger numbers make bigger cards; they overlap a little when the screen is small.
- Drift speed: `TURN` in `orbit.js` is the seconds for one full turn. How long a flick coasts: the `2.2` in `coast *= Math.exp(-dt * 2.2)` (smaller coasts longer).
- The "ez" key in the middle logo is `public/images/logo-key-reversed.svg` (brown key, ivory outline and letters). It is a separate file so `tools/tighten_wordmark.py` does not overwrite it.
- The ivory outline around the middle logo and text is the `filter` / `text-shadow` on `.centre` in `style.css`. Make the numbers smaller for a thinner outline.

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
