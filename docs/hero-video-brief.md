# Hero video — orbit around an overhead crane

For the homepage hero, later driven by the `cinematic-scrub-landing` technique
(mouse position scrubs the timeline).

## Hard constraints, and why

**One continuous move. No cuts, no dissolves, no speed ramps.** The viewer
drags the timeline with the cursor and stops wherever they like. A cut becomes
a jarring jump they control; a speed ramp makes the drag feel broken. Every
single frame has to stand on its own.

**Constant angular velocity.** If the orbit accelerates, the drag feels sticky
in some places and slippery in others. Even speed is what makes scrubbing feel
expensive.

**Deliver 16 seconds, 4K, 24fps, no audio, no titles.** 16s at 24fps is 384
frames — plenty for a smooth scrub without a heavy asset. Audio is discarded;
the hero is muted.

**Aspect: 21:9** if the generator supports it, otherwise 16:9 (the hero frame
crops to 21:9 and there is enough headroom).

**The logo is in the shot — as a painted mark on a wall, not as graphics.**
Two rules make this work. First: **the emblem only, never the Hebrew wordmark.**
A gear ring with a drafting compass and a hook is a shape a model can draw;
Hebrew letterforms come back as gibberish every time. Second: describe it as
something physically present in the space — stencilled paint on concrete, lit
by the same lamps as everything else. Models render industrial signage far
better than they render "an overlaid logo".

The wordmark `ארזי מיטב המהנדסים בע"מ` is composited afterwards from the real
SVG, beside the painted emblem. That keeps the type crisp and correct while the
emblem is genuinely part of the scene.

If your generator accepts a reference image, feed it `docs/logo-mark-reference.png`
— the emblem alone, flat brand blue on white. That raises fidelity more than
any amount of prompt wording.

---

## The prompt

Paste as one block.

```
A single continuous 16-second orbital camera move around an overhead bridge
crane inside a working industrial production hall. Shot on a full-frame cinema
camera with a 35mm prime at T2.8, mounted on a slow-moving dolly circling the
subject at a constant, unvarying speed — roughly 150 degrees of arc across the
whole shot, never accelerating, never stopping.

SUBJECT: The crane's hoist trolley and hook block, hanging at chest height in
the centre of the frame, remain the anchor of the composition throughout the
entire orbit — the camera revolves around them while they stay locked in place.
The forged steel hook with its closed spring safety latch, the wire rope wound
onto the sheave, the grease and steel dust on the housing. Directly behind the
hook, the crane's welded box girder spans the hall and stays visible across the
move. A certified inspector in a white hard hat and hi-vis vest stands to one
side, one gloved hand resting on a control pendant, looking at the hook and
never at the camera; he shifts his weight once during the shot and turns his
head slowly to follow a component.

ENVIRONMENT: A real, used production hall. Machine tools, stacked steel stock,
pallets, painted floor lanes worn thin by traffic, cable trays overhead. A
forklift crosses the far background once, unhurried. Nothing is staged or
tidied. Depth is layered: hook in the foreground plane, girder in the middle,
hall receding behind.

LIGHT: Available light only. Cool daylight falling from dusty roof skylights
mixes with warm high-bay lamps. As the camera orbits, the key light travels
across the hook — it starts side-lit, passes through backlit with a hard rim
along the steel at the midpoint, and resolves into soft frontal light. That
travelling light is the reason the shot is worth scrubbing.

ATMOSPHERE: Fine dust suspended in the shafts of skylight, drifting slowly and
catching the light when the camera is backlit. Faint heat shimmer near the
lamps. No smoke machine look, no volumetric god-ray exaggeration.

GRADE: Muted and restrained. Cool neutral shadows leaning slightly blue-navy,
warm highlights from the work lighting, low saturation, true-to-life contrast.
Filmic latitude, gentle highlight rolloff, no HDR, no crushed blacks, no
teal-and-orange.

REALISM: This must read as documentary footage, not a render. The dolly carries
a barely perceptible mechanical unevenness — a micro-vibration in the frame,
not a shake. Focus breathes very slightly once as the distance changes. A trace
of sensor grain. Slight lens softness at the extreme corners. The orbit path is
not a mathematically perfect circle; the radius varies by a hand's width. No
element is symmetrical, nothing is perfectly clean, no surface is pristine.

FINAL 4 SECONDS: The orbit brings a large flat section of dark grey concrete
wall into the right two-thirds of the frame, free of machinery and pipework.
Stencilled onto that wall in flat industrial blue paint, roughly a metre and a
half across, is a single geometric emblem: a circular gear ring with square
teeth around its rim; inside the ring, a drafting compass with two straight
legs meeting at a pivot at the top; below the compass, a lifting hook curving
downward. Flat single-colour paint, slightly worn and faded at the edges, with
a little dust and a paint drip — signage that has been on that wall for years,
not a decal applied yesterday. It is lit by the same overhead lamps as the rest
of the hall and sits flat on the surface, following the wall's texture and
perspective as the camera moves past. No lettering, no words, no characters of
any kind beside it. The hook of the crane remains in the left third. The camera
keeps moving at the same speed through to the last frame — it does not slow,
settle or stop.

Israeli industrial setting. Apart from the painted emblem described above,
there is no signage, lettering or text of any kind anywhere in frame.
```

## Negative prompt

```
cuts, jump cuts, dissolves, transitions, speed ramps, slow motion, time-lapse,
camera stopping, accelerating or decelerating, orbiting more than once,
text, letters, words, lettering, Hebrew characters, Arabic characters,
typography, subtitles, watermarks, brand names, company names,
glowing logo, floating logo, animated logo, logo overlay, decal, sticker,
people looking at camera, smiling, posing, waving, stock-footage styling,
CGI, 3D render, video game look, unreal engine, perfect symmetry, glossy
surfaces, showroom cleanliness, malformed machinery, impossible mechanics,
missing hook safety latch, floating objects, distorted hands, extra fingers,
HDR, oversaturation, teal-orange grade, heavy vignette, lens flare, light
leaks, bokeh balls, drone footage, handheld shake, whip pans, zoom
```

## Generator settings

| Setting | Value |
|---|---|
| Duration | 16s (or the longest single clip the model allows — never stitch two clips) |
| Frame rate | 24fps |
| Resolution | 4K, or 2K upscaled |
| Aspect | 21:9, else 16:9 |
| Motion strength | Low to medium — the move is a slow dolly, not action |
| Seed | Lock it once a take works, then vary only the prompt |

## What to check in every take before accepting it

1. **Does the speed stay constant?** Scrub it by hand in a video editor. Any
   spot where the image races or drags will feel broken on the page.
2. **Does the hook stay centred?** If the anchor drifts, the orbit reads as a
   pan and the effect collapses.
3. **Is the safety latch on the hook?** A hook without one is a defect a
   certified inspector spots in the first second.
4. **Is the painted emblem readable as the mark?** Gear ring, compass inside,
   hook below. If the model invented a different shape, reject the take — a
   wrong emblem is worse than none, and it is the one thing you cannot fix in
   post without covering it up.
5. **Any lettering anywhere?** Including beside the emblem. Generated text is
   never real language, and Hebrew least of all.

Generate four takes and pick on these five points, not on which is prettiest.

## Then the wordmark

The painted emblem is in the footage. The Hebrew wordmark goes over it
afterwards from `public/logo/ardi-logo.svg`, set beside or beneath the painted
mark on the same wall, fading up across about 500ms in the last two seconds.

Do this as an SVG layer over the video, not baked into the frames: it stays
crisp at any resolution, it survives a re-cut, and the same layer can animate
at no download cost — the gear turning a few degrees into place as the wordmark
arrives.

**If the emblem in the footage comes out wrong** and you do not want to
regenerate, the fallback is to keep the clear wall and composite the whole
logo — emblem and wordmark together — onto it. The shot still works; you just
lose the "it was always painted there" effect.
