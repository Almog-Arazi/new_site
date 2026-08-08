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

**No logo in the video.** A generative model will render the mark as moving
gibberish, which reads far worse than no logo at all. The prompt below reserves
a clean dark wall in the closing seconds; the real SVG is composited over it.

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

FINAL 3 SECONDS: The orbit brings a large, flat, unlit section of dark grey
concrete wall into the right two-thirds of the frame, uncluttered and free of
machinery, pipes or signage. The hook remains in the left third. The camera
keeps moving at the same speed through to the last frame — it does not slow,
settle or stop.

Israeli industrial setting. No signage or text of any kind anywhere in frame.
```

## Negative prompt

```
cuts, jump cuts, dissolves, transitions, speed ramps, slow motion, time-lapse,
camera stopping, accelerating or decelerating, orbiting more than once,
text, letters, signage, watermarks, logos, brand names, subtitles,
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
4. **Is the closing wall actually clear?** The logo needs somewhere to land.
5. **Any text anywhere?** Even blurred signage in the background is a problem —
   generated lettering is never real language.

Generate four takes and pick on these five points, not on which is prettiest.

## Then the logo

Composite `public/logo/ardi-logo.svg` over the final 2–3 seconds, on the dark
wall, fading up over about 500ms and holding to the last frame. It is a vector,
so it stays crisp at any resolution and can be repositioned or restyled later
without touching the footage.

An animated variant is available at no download cost, since the mark is an SVG:
the gear rotates a few degrees into place, the compass legs close, the hook
settles. That can be done in CSS over the video rather than baked into it —
which also means it survives a re-cut of the footage.
