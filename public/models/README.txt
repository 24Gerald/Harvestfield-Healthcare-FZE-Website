3D models for the site, uploadable from the admin panel (3D models tab).

Served at /models/<file>. Which element a model drives is set in code, so
uploading a file does not change the site on its own — send the path to your
developer.

Currently wired:
  models/mosquito/scene.gltf   → the hero mosquitoes
                                 (HERO_MOSQUITO_MODEL in src/data/siteConfig.js;
                                  falls back to the procedural mosquito if absent)

Notes:
  - GLB is one self-contained file and is the easier format to hand over.
  - A .gltf is a package: it references its .bin and texture files by name, so
    upload all of them and do not rename any.
  - Keep files under 24 MB (the admin's ceiling). If a model is larger, decimate
    the mesh or compress with Draco / glTF-Transform first — the file is
    downloaded by every visitor, so smaller is better regardless.
