# Instrument Mixer

A small web app for kids. Tap two instruments and hear the one they make together.

There are no audio files. Each of the 15 instruments is stored as a set of synthesis
parameters: harmonic amplitudes, envelope times, noise content, filter cutoff, vibrato
and pitch drop. Mixing two instruments averages those numbers and plays the result
through the Web Audio API, so every pair produces a sound that is not stored anywhere
in the file. The pictures work the same way. One drawing routine renders every
instrument from its trait weights, so a hybrid inherits a bell, a neck, finger holes or
a drumhead depending on what went into it.

The instrument tapped first counts for 60 percent of the mix, so Trumpet + Bongo
("Trungo") and Bongo + Trumpet ("Bonpet") sound different from each other. That makes
210 combinations. Found combinations are saved in the browser with localStorage.

Add it to an iPad home screen from Safari's Share menu and it opens full screen with
its own icon, and a service worker keeps it working without a connection. Navigations
are network-first, so a new push still arrives as soon as the iPad is online.

Everything is in `index.html`. There is no build step and the only outside dependency
is a Google Fonts stylesheet. The icons are generated from the app's own drawing code:
`icon-source.svg` is the master, and the PNGs are sized down from it.
