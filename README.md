# BEYOND THE OUTBREAK — GitHub Pages Website

A free static website for the Beyond the Outbreak DayZ community. **Only two servers are included:** Deer Isle and Badlands DLC.

## Publish to your EXISTING GitHub repository

Your repository: https://github.com/zooyork3331-hash/beyond-the-outbreak

1. Download `Beyond-the-Outbreak-Website.zip` from ChatGPT.
2. **Extract** the ZIP on your computer. Do not upload the ZIP itself as your website.
3. Open the `bto-website` folder. You should see `index.html`, `deerisle.html`, `badlands.html`, `rules.html`, `styles.css`, `site-settings.js`, `site.js`, and the `assets` folder.
4. Open your GitHub repository, switch to the `main` branch, and choose **Add file > Upload files**.
5. Drag **everything INSIDE the `bto-website` folder** onto the upload page, including the `assets` folder. If your browser doesn't accept the whole folder, add the main files first, then create the `assets/photos` directory and upload `PHOTO-GUIDE.txt` separately.
6. Click **Commit changes**. Uploading the included `index.html` replaces the old basic one.
7. Wait a minute or two and refresh: https://zooyork3331-hash.github.io/beyond-the-outbreak/ (try Ctrl+F5 if you see the old version).

**Important:** Upload website files into your repository's top level, not into a separate `bto-website` subfolder. `index.html` must be in the repository root for the existing GitHub Pages configuration (main / root).

## Add custom photos — no coding necessary

Drag photos into `assets/photos/` in your repository. Use these **exact filenames** and JPG format:

| File | Where it appears |
| --- | --- |
| `home-hero.jpg` | Large background on home page and rules page |
| `deerisle-cover.jpg` | Deer Isle server card on home page |
| `badlands-cover.jpg` | Badlands server card on home page |
| `deerisle-hero.jpg` | Large Deer Isle page header |
| `badlands-hero.jpg` | Large Badlands page header |
| `deerisle-1.jpg` | Deer Isle gallery image 1 |
| `deerisle-2.jpg` | Deer Isle gallery image 2 |
| `deerisle-3.jpg` | Deer Isle gallery image 3 |
| `badlands-1.jpg` | Badlands gallery image 1 |
| `badlands-2.jpg` | Badlands gallery image 2 |
| `badlands-3.jpg` | Badlands gallery image 3 |

Missing photos show stylish dark green placeholders rather than broken images.

**Helpful size:** Use 1920×1080 JPGs for hero/cover photos; 1200×800 JPGs for gallery photos. Compress large images if possible. Avoid uploading copyrighted photos you don't have permission to use.

### Adding photos on the GitHub website

1. Go to `assets/photos/` in your repository. If it isn't there, choose **Add file > Create new file** and name it `assets/photos/PHOTO-GUIDE.txt`, add any text, and commit once to establish the folder.
2. Choose **Add file > Upload files**.
3. Drop the correctly named `.jpg` photos and commit.
4. Refresh your public website. They'll appear automatically.

## Change your Discord, support link, and server IPs

Edit `site-settings.js` in GitHub:

```js
window.BTO_SETTINGS = {
  discordInvite: "https://discord.gg/YOUR-CODE",
  supportLink: "https://YOUR-SUPPORT-PAGE",
  deerIsleAddress: "YOUR-IP:YOUR-PORT",
  badlandsAddress: "",
  communityEmail: ""
};
```

- Empty Discord/support links hide the corresponding buttons, avoiding dead links.
- Server IPs display on their individual pages and gain a working **Copy server address** button.
- Leave the Badlands IP empty until it's available.
- `supportLink` links offsite only. Make sure any supporter benefits comply with DayZ / Bohemia Interactive monetization rules.

## Change the wording, rules, and Tips & Tricks

Edit the corresponding HTML file directly on GitHub using the pencil icon:

- `index.html` — homepage introductions and server cards.
- `deerisle.html` — Deer Isle overview, six editable tips, gallery captions, and abbreviated rules.
- `badlands.html` — Badlands overview, six editable tips, gallery captions, and future rules.
- `rules.html` — main community rules.
- `styles.css` — layout, appearance, and colors.

Tip text is regular HTML and lives near its heading. For example, search `START WITH THE BASICS` in `deerisle.html`, then replace the paragraph just below it.

**Please check your Deer Isle rules before publishing**: this starter site uses your previously discussed PvE rules (no PvP/raiding, one base per player, 500m from military, 1000m from traders). Badlands details are intentionally labeled *Coming soon* rather than invented.

## Changing Badlands from "Coming soon" to "Active"

Once the server launches, edit `index.html` and `badlands.html`. Replace the visible "COMING SOON" text, update the Badlands server status in the overview table, replace placeholder copy with actual details, and update your rules. You can use GitHub's search function in each file to find each instance.

## File structure

```text
index.html
badlands.html
deerisle.html
rules.html
styles.css
site-settings.js
site.js
README.md
assets/
  photos/
    PHOTO-GUIDE.txt
    (upload your .jpg photos here)
```

Everything works on free GitHub Pages without a backend, subscriptions, or special build tools. No database is involved.
