Photos for the "Inside the factory" slider on the home page.

Drop JPG / PNG / WebP files here and they are picked up automatically (no code
change). They roll past in file-name order, so prefix the names to set the
order, e.g.  01-sewing-line.jpg  02-quality-check.jpg  03-team.jpg

The admin panel's "Gallery" tab uploads here too (it numbers the files for you
and resizes them to 1800px on the long edge). The slider is hidden until at
least one photo exists.

One photo is held back from the slider and shown as the still image under the
heading in "The Factory" instead. It is named by FACTORY_STILL in
src/data/siteConfig.js — currently 11-harvestfield-healthcare-78.jpg, the wide
shot of the production hall. So the count in the admin Gallery tab is one more
than the slider shows, on purpose: the same picture is not used twice. To swap
which photo that is, change that one setting; to put it back in the slider, set
FACTORY_STILL to ''.
