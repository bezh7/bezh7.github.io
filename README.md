# Ben Zhang's website

Static HTML, CSS, and JavaScript hosted on GitHub Pages.

## Adding a lunar construction rover update

The build log lives in `lunar-construction-rover/index.html`, at `/lunar-construction-rover/` on the website.

1. Copy the commented `<article class="log-entry">` template in that file and paste it **outside the comment**, immediately below the Updates heading. Put newer posts above older ones.
2. Replace the title and body. Use a unique `id` (for example, `first-drive`) and the same value in the title's `href` (`#first-drive`) so each update has a direct link.
3. Set `datetime` to the post date in `YYYY-MM-DD` format and write the readable date between the `<time>` tags.
4. For photos, create `images/rover/`, add your image, and update the `<img>` path, descriptive `alt` text, and caption. Remove the `<figure>` if the post has no photo.
5. Delete the `log-empty` paragraph when publishing the first update.
6. Commit the changes and merge them into `main` to publish through GitHub Pages.

Posts support paragraphs, links, lists, and photos using ordinary HTML. No build step is needed.

## Local preview

From the repository root, run `python3 -m http.server 8000`, then open `http://localhost:8000/` or `http://localhost:8000/lunar-construction-rover/`.
