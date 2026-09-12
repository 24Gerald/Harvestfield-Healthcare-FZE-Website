Photographic hero background.

Put the approved photograph here as:

  hero-mother-and-child.jpg      (.webp or .png also work — update
                                  HERO_BACKGROUND.src in src/data/siteConfig.js
                                  if you change the extension)

As soon as the file exists the hero switches to it: the illustrated 3D net is
replaced by the photograph and only the mosquitoes render over it. Until then
the hero keeps the 3D net, so the page is never a bare gradient.

Guidance:
  - Landscape, at least 2000px wide. The hero crops to fill, so nothing should
    depend on the exact edges.
  - Keep the subject right of centre; the headline sits on the left. Adjust
    HERO_BACKGROUND.position / positionMobile to move the crop.
  - Export around 80% quality. This is the largest image on the site and it
    loads before anything else.
  - Check the white headline against it and raise HERO_BACKGROUND.overlay if
    the contrast is tight.

Licensing: only use a photograph the company owns or has a licence for. A
stock or press image of an identifiable person needs a model release for
commercial use.
