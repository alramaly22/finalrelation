Project Hope — Gallery Photos
=============================

Drop your 4 photos here with these exact filenames:

  01.jpg
  02.jpg
  03.jpg
  04.jpg

That's it — no code changes needed. The gallery already points to
these paths (see js/gallery.js), and each card automatically detects
whether its file exists:

  - File missing  -> shows an elegant placeholder (number + icon)
  - File present  -> shows your real photo with the hover story overlay

Tips for best results:
  - Portrait or tall images work best (the cards are taller than wide)
  - Roughly 1000px+ on the longest side is plenty for web quality
  - Keep file sizes reasonable (a few hundred KB each) so the page
    loads quickly

Want more or fewer than 4 photos, or different titles/captions?
Edit the `galleryData` array at the top of js/gallery.js — each
entry just needs an image path, a title, and a short line of text.
