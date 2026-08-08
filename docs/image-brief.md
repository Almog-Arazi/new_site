# מפרט תמונות — ארזי מיטב המהנדסים

60 מקומות לתמונה באתר, מהם **27 תמונות ייחודיות** (הרבה מהן חוזרות במספר עמודים).
המסמך הזה הוא גם רשימת הצילומים ליום צילום, גם מפרט הפרומפטים לייצור AI.

---

## אזהרה מקצועית — קראו לפני שמייצרים

**מסמך האפיון אוסר מפורשות** תמונות AI עבור "תמונות מרכזיות של בדיקות, יצירת ציוד
שלא קיים, ואנשים שנראים לא אמיתיים". הסיבה מעשית, לא אידאולוגית:

הקהל שלך הוא מנהלי אחזקה וממוני בטיחות. הם מסתכלים על תורן מלגזה ורואים מיד אם
שרשרת ההרמה מחוברת בשטות, אם לשאקל אין פין, או אם קו החיים מעוגן לאלמנט שלא
נושא עומס. מודלים לייצור תמונות **נכשלים בדיוק בזה** — הם מייצרים מכונות שנראות
נכון למי שלא מבין, ושבורות למי שכן. תמונה כזאת לא סתם לא עוזרת; היא הורסת אמון
אצל בדיוק האדם שאתה רוצה שיתקשר.

לכן כל תמונה מסומנת כאן ברמת סיכון:

| דירוג | פירוש | המלצה |
|---|---|---|
| 🟢 | סביבה, אווירה, מרחב — אין רכיב מכני שנשפט | AI בסדר גמור |
| 🟡 | ציוד נראה אבל לא במוקד, במרחק | AI אפשרי, דורש בדיקה של מקצוען |
| 🔴 | מקרו על רכיב מכני, או בודק בפעולה | **צילום אמיתי.** AI ייכשל וייראה מזויף |

מתוך 27: **9 ירוקות · 11 צהובות · 7 אדומות**. הצעה מעשית — לייצר את הירוקות
והצהובות ב-AI כדי לעלות לאוויר, ולהחליף את השבע האדומות ביום צילום קצר.

---

## מפרט טכני אחיד

**רזולוציית מקור:** 2400×1600 (יחס 3:2). האתר חותך ממנה שני יחסים:

| שימוש | יחס | קומפוננטה |
|---|---|---|
| Hero של עמוד פנימי, פסקאות תמונה+טקסט | 4:3 | `PageHead`, `PhotoBand`, `HomeWhy`, `contact` |
| כרטיסי ציוד ושירות, hero של הבית | 21:9 | `EquipmentGrid`, `LinkCards`, `Hero`, `HomeServices` |

**חשוב:** הרכיבו עם "אזור בטוח" במרכז. חיתוך 21:9 לוקח רק את הפס האמצעי — אם
הנושא בשליש העליון או התחתון, הוא ייחתך.

**פורמט מסירה:** WebP איכות 82, רוחב מקסימלי 1600px לאתר. שם קובץ = ה-ID כאן
(`img-01-hero-inspector.webp`). להעלות ל-`public/uploads/`.

---

## סגנון אחיד — הדבק את הבלוק הזה בתחילת כל פרומפט

זה מה שהופך 27 תמונות נפרדות לסט אחד. בלי זה תקבל אוסף מקרי.

```
STYLE SYSTEM (prepend to every prompt):
Documentary industrial photography, shot on a full-frame camera with a prime
lens. Available light only — no studio strobes, no artificial fill. Natural
industrial lighting: overhead sodium and LED high-bays, daylight through
factory windows or skylights. Muted, restrained colour grade: cool neutral
shadows leaning slightly blue-navy, warm highlights from the work lighting.
Low saturation, true-to-life contrast, no HDR, no lens flare, no bloom.
Composition is calm and deliberate, horizon level, generous negative space,
subject placed on a third. Everything is real, worn, in use — dust, scuffed
paint, cable ties, floor markings. Nothing staged, nothing pristine, nothing
heroic. The mood is competent and quiet, not dramatic.
Israeli industrial context: no American OSHA signage, no English-language
warning text, no foreign-looking branding.
```

```
NEGATIVE (append to every prompt):
text, letters, signage, watermark, logo, brand name, distorted hands, extra
fingers, malformed machinery, floating objects, impossible mechanics, people
smiling at camera, direct eye contact, posed handshake, stock-photo styling,
plastic skin, beauty retouching, HDR, oversaturated, teal-orange grade, heavy
vignette, lens flare, bokeh balls, cartoon, illustration, 3D render, CGI,
video game, blurry, motion blur, tilted horizon, fisheye, missing hard hat,
missing hi-vis vest, unsafe rigging
```

**כלל PPE — קריטי לאמינות:** בכל תמונה שיש בה אדם: קסדה, אפוד זוהר, כפפות
ונעלי בטיחות. בודק בלי קסדה באולם ייצור = הלקוח שלך מפסיק לקרוא.

**כלל פנים:** בלי מבט למצלמה. שלושת-רבעי, מהגב, או קדרה על הידיים. זה גם נראה
אמיתי יותר וגם חוסך את הבעיה הכי גדולה של מודלים — פנים שנראות מלאכותיות.

---

# רשימת התמונות

## קבוצה A — פתיחה ואנשים

### IMG-01 · וידאו/תמונת Hero ראשית 🔴
**איפה:** `src/pages/index.astro` — המסך הראשון של האתר · 21:9 · **עדיפות 1**
**ALT:** בודק מוסמך מטעם ארזי מיטב המהנדסים בסביבת מפעל פעיל עם ציוד הרמה
**במפרט:** וידאו 15–30 שנ׳ — מפעל פעיל, עגורן גשר בעבודה, בודק עם ציוד מדידה

```
A certified lifting-equipment inspector stands in an active production hall,
seen from three-quarters behind, holding a clipboard and a measuring device.
An overhead bridge crane moves along its rails in the mid-background, a
forklift works further back. He wears a white hard hat, hi-vis vest over a
work shirt, gloves. Wide establishing shot, 35mm lens at f/5.6, camera at
chest height. Deep space, layered foreground-midground-background. Light comes
from high-bay fixtures overhead and a bank of dusty skylights. Subject on the
right third, crane occupying the upper left.
```
> זו התמונה שהאתר נשען עליה. אם משהו אחד מצולם באמת — זה זה.

### IMG-02 · פורטרט הבודק בשטח 🔴
**איפה:** `about.md` hero · 4:3 · עדיפות 1
**ALT:** בודק מוסמך בשטח לצד ציוד הרמה גדול במפעל

```
Environmental portrait of a certified inspector in his fifties standing beside
large lifting equipment inside a factory. He looks off-camera toward the
equipment, not at the lens. Hard hat, hi-vis vest, gloves tucked in a pocket.
85mm lens at f/4, subject sharp, machinery softly separated behind him.
Natural window light from camera left, no fill. Shoulders squared, relaxed
stance, hands at his sides — an experienced professional, not a model.
```

### IMG-03 · משרד פעיל ומערכת מעקב 🟡
**איפה:** `about.md`, `HomeWhy.astro`, `blog/index.astro` · 4:3 · עדיפות 2
**ALT:** משרד פעיל עם מערכת מעקב אחר מועדי בדיקה ותסקירים

```
A working desk in a small engineering office. A monitor shows a scheduling
table of upcoming inspection dates — rows and dates only, no readable words.
Beside it: a ring binder of inspection reports, a desk phone, a mug, reading
glasses on a printed page. No person in frame, or only a forearm reaching for
the mouse. 35mm at f/4, slightly elevated three-quarter angle. Soft daylight
from a window off-frame left. Lived-in, organised, not a showroom.
```
> **חשוב:** אם המסך מציג טקסט — הוא ייצא ג'יבריש. בקש טבלה עם תאריכים ומספרים בלבד.

---

## קבוצה B — עגורנים

### IMG-04 · עגורן גשר באולם ייצור (הכללי) 🟡
**איפה:** 8 מקומות — `equipment.json`, `HomeServices`, `services.md`, `faq.md`, `about.md`, `forklift-inspection.md`, `lifting-equipment-inspection.md` · 21:9 · **עדיפות 1** (התמונה הכי חוזרת באתר)
**ALT:** עגורן גשר באולם ייצור

```
An overhead bridge crane spanning a working production hall, viewed from the
floor at a low angle. The main girder crosses the upper third of the frame,
runway rails visible on both sides, hoist trolley and hook block hanging at
centre. Industrial roof structure and skylights above. Machinery and stacked
material below, out of focus. 35mm at f/6.3. Cool daylight from skylights
mixing with warm high-bay lamps. Wide horizontal composition with the crane
as a strong horizontal line.
```

### IMG-05 · עגורן גשר — זווית נמוכה, קורה ומסילות 🟡
**איפה:** `crane-inspection.md` hero · 4:3 · עדיפות 2
**ALT:** עגורן גשר נע על מסילות באולם ייצור לפני בדיקה תקופתית

```
Low-angle view looking up at an overhead bridge crane, emphasising the box
girder and the runway rails it travels on. Steel structure fills the upper two
thirds, converging perspective lines. The hoist trolley sits mid-span. 24mm at
f/8, camera nearly at floor level, tilted up. Backlit by roof skylights so the
steel reads as a dark silhouette with rim light along its edges.
```

### IMG-06 · מערכת הרמה של עגורן מקרוב 🔴
**איפה:** `crane-inspection.md` section · 4:3 · עדיפות 2
**ALT:** אונקל, כבל פלדה וגלגלת של עגורן גשר במבט מקרוב

```
Tight detail of a crane hoist assembly: the forged hook with its safety latch,
the wire rope wound onto the sheave above it, the hook block housing. Grease,
steel dust and honest wear on every surface. 85mm at f/4, hook sharp, hall
falling away into soft shadow behind. Light rakes across the steel from one
side, showing the lay of the wire rope strands.
```
> 🔴 **מקרו על רכיב מכני = הסיכון הגבוה ביותר ב-AI.** מודלים מייצרים אונקלים
> בלי לשון בטיחות, כבלי פלדה עם שזירה בלתי אפשרית וגלגלות שלא מסתובבות על כלום.
> בודק מוסמך יזהה את זה בשנייה.

### IMG-07 · עגורן חדש לאחר התקנה 🟡
**איפה:** מאמר `initial-vs-periodic-inspection.md` · 4:3 · עדיפות 3
**ALT:** עגורן גשר חדש לאחר התקנה באולם ייצור, לפני הפעלה ראשונה

```
A newly installed overhead crane in a hall that is not yet in production. The
paint is fresh, the floor is clean and empty, protective film still clings to
part of the control pendant. Packaging material and an installation ladder off
to one side. 35mm at f/5.6. Bright, even daylight, cooler than the other
frames. The emptiness is the point — nothing has been lifted yet.
```

### IMG-08 · עגורן שער בחצר מפעל בדרום 🟢
**איפה:** `lifting-inspection-south.md` section · 4:3 · עדיפות 3
**ALT:** עגורן שער בחצר מפעל באזור הדרום לפני בדיקה תקופתית

```
A gantry crane standing in an open industrial yard in southern Israel. Stacked
steel and concrete elements beneath it. Flat arid ground, dust hanging in the
air, low scrub and a distant ridge on the horizon. 35mm at f/8. Harsh
high-sun light, hard shadows, slightly hazy sky bleached toward white. The
heat should be visible.
```

---

## קבוצה C — מלגזות

### IMG-09 · מלגזה במחסן לוגיסטי (הכללי) 🟡
**איפה:** `equipment.json`, `lifting-equipment-inspection.md` · 21:9 · **עדיפות 1**
**ALT:** מלגזה במחסן לוגיסטי במהלך בדיקת בודק מוסמך

```
An electric counterbalance forklift parked in the aisle of a logistics
warehouse, seen from a front three-quarter angle. Tall pallet racking recedes
on both sides, pallets wrapped in stretch film. Painted floor lanes. 35mm at
f/6.3, camera at chest height. Cool LED warehouse lighting, long aisle
perspective. Wide horizontal framing, forklift on the left third, aisle
drawing the eye to the right.
```

### IMG-10 · בודק בוחן תורן מלגזה 🔴
**איפה:** `forklift-inspection.md` hero · 4:3 · **עדיפות 1** (עמוד ה-SEO הראשי)
**ALT:** מלגזה חשמלית במחסן לוגיסטי במהלך בדיקת בודק מוסמך

```
An inspector crouched at the front of a forklift, examining the mast assembly.
Seen from the side, his face turned toward the machine. Hard hat, hi-vis vest,
one gloved hand resting on the mast channel, a checklist in the other. The
lift chain and carriage are clearly visible. 50mm at f/4. Warehouse racking
soft behind. Warm task light on the metal, cooler ambient beyond.
```

### IMG-11 · תורן מלגזה מקרוב 🔴
**איפה:** `forklift-inspection.md` section, מאמר `forklift-inspection-guide.md` · 4:3 · עדיפות 2
**ALT:** בדיקת תורן מלגזה מקרוב, לצד בדיקת שילדת הכלי

```
Macro detail of a forklift mast: the leaf chain running over its sheave, the
carriage rollers in their channel, the base of the forks. Grease on the chain,
paint worn to bare metal at the wear points. 85mm at f/3.5, chain sharp,
depth falling away fast. Raking side light picking out each chain plate.
```
> 🔴 שרשרת הרמה היא רכיב שמודלים כמעט תמיד מייצרים שגוי.

### IMG-12 · צי מלגזות במרכז הפצה 🟡
**איפה:** `lifting-inspection-center.md` section · 4:3 · עדיפות 3
**ALT:** בדיקת צי מלגזות במרכז הפצה באזור המרכז

```
A row of six forklifts parked nose-out on charging bays at the end of a
distribution centre, plugged in for the night. An inspector walks the line
with a clipboard, seen small in the frame from behind. 35mm at f/7.1, straight
down the row so the machines repeat into the distance. Even cool LED light.
The repetition is the subject — this is fleet scale, not one machine.
```

---

## קבוצה D — במות הרמה

### IMG-13 · במת מספריים פרושה 🟡
**איפה:** `equipment.json`, `lift-platform-inspection.md` hero, `forklift-inspection.md` · 21:9 + 4:3 · עדיפות 2
**ALT:** במת הרמה מסוג מספריים פרושה באתר עבודה לקראת בדיקה

```
A scissor lift raised to roughly four metres inside an industrial building, its
scissor stack fully extended, guardrails and toe boards visible on the
platform. Nobody aboard. Outriggers down on the concrete. 35mm at f/6.3 from a
slight distance so the whole machine and the space around it are in frame.
Overhead industrial light, machine reading as a strong vertical against a
horizontal space.
```

### IMG-14 · במת הרמה — רגלי ייצוב ומעקות 🔴
**איפה:** `lift-platform-inspection.md` section · 4:3 · עדיפות 3
**ALT:** רגלי ייצוב ומעקות בטיחות של במת הרמה בפריסה מלאה

```
Detail of a lift platform's stabiliser leg planted on concrete, its footplate
bearing load, hydraulic ram and hose visible above. In the upper frame, the
platform's guardrail and control panel. 50mm at f/4, low camera looking
slightly up. Hard directional light, deep shadow under the footplate.
```

### IMG-15 · במה אנכית במבנה מודרני (שרון) 🟢
**איפה:** `lifting-inspection-sharon.md` hero · 4:3 · עדיפות 3
**ALT:** במת הרמה אנכית בתוך מבנה תעסוקה באזור השרון

```
A vertical mast lift standing in the clean lobby-adjacent service area of a
modern office building. Polished concrete floor, glass curtain wall, planted
courtyard beyond. The machine is compact and tidy — this is facilities work,
not heavy industry. 35mm at f/5. Abundant soft daylight through the glass,
cool white palette, minimal contrast.
```

---

## קבוצה E — אביזרי הרמה

### IMG-16 · פריסת אביזרי הרמה 🟡
**איפה:** `equipment.json`, `HomeServices`, `lifting-accessories.md` hero, `services.md`, `faq.md`, `about.md`, מאמר · 21:9 + 4:3 · **עדיפות 1**
**ALT:** רצועות הרמה, שרשראות ושאקלים מונחים לקראת בדיקה יסודית

```
An orderly flat-lay on a steel workbench: two polyester round slings coiled,
a webbing sling folded, a length of grade-80 lifting chain, three bow
shackles, a master link. Arranged with space between the items so each reads
clearly. Shot straight down from above, 50mm at f/8, everything in focus.
Soft broad daylight from a high window, gentle shadows. Worn bench surface,
faint chalk marks. The gear is used, not new.
```

### IMG-17 · מקרו — תג עומס ושחיקה בשרשרת 🔴
**איפה:** `lifting-accessories.md` section · 4:3 · עדיפות 2
**ALT:** תג סימון עומס על רצועת הרמה וסימני שחיקה בחוליית שרשרת

```
Extreme close-up, split between two subjects: the sewn identification tag on a
lifting sling in the foreground, and a single chain link showing a bright worn
facet where steel has rubbed steel. 100mm macro at f/5.6, focus stacked so both
read. Raking light across the surfaces to reveal texture — the fibre weave of
the tag, the polished wear scar on the link.
```
> 🔴 האזור הכי רגיש בכל האתר. עמוד שלם מדבר על "איך מזהים אביזר פסול" — תמונה
> שמראה שחיקה שנראית לא נכון סותרת את הטקסט שלידה. **צילום אמיתי בלבד.**

---

## קבוצה F — קווי חיים

### IMG-18 · קו חיים אופקי על גג תעשייתי 🟡
**איפה:** `equipment.json`, `HomeServices`, `lifeline-inspection.md` hero, `services.md`, `faq.md`, `about.md`, מאמר · 21:9 + 4:3 · **עדיפות 1**
**ALT:** מערכת קו חיים אופקי מותקנת על גג מבנה תעשייתי

```
A horizontal lifeline running the length of an industrial roof: a tensioned
stainless cable carried on intermediate anchor posts bolted through the roof
sheeting, an end anchor at the near post. Roof plant — ducts, extract fans —
in the middle distance. 35mm at f/7.1, camera low so the cable line runs from
the near corner into the distance. Late-afternoon low sun, long shadows across
the ribs of the roof, warm light on cool grey metal.
```

### IMG-19 · נקודת עיגון מקרוב עם יד 🔴
**איפה:** `lifeline-inspection.md` section · 4:3 · עדיפות 2
**ALT:** בדיקת נקודת עיגון על גג — כבל, מחבר ואמצעי הידוק

```
A gloved hand holding a steel karabiner clipped to an anchor point on a roof
lifeline. The anchor base plate, its fixings and the tensioned cable are all in
frame. Only the hand and forearm of the person — no face. 85mm at f/3.5,
karabiner and anchor sharp, roof falling into soft distance. Overcast diffuse
light, no hard shadows.
```
> 🔴 ידיים + חומרת בטיחות = שתי החולשות הגדולות של מודלים בפריים אחד.

### IMG-20 · קו חיים על גג משרדים בשרון 🟢
**איפה:** `lifting-inspection-sharon.md` section · 4:3 · עדיפות 3
**ALT:** קו חיים ונקודות עיגון על גג מבנה משרדים בשרון

```
A lifeline system on the flat roof of a modern office building. Rows of
condenser units, a tidy paved roof surface, a parapet, low residential
buildings and treetops beyond. 35mm at f/6.3. Soft golden-hour light, gentle
warm-cool contrast, calm sky. Cleaner and more suburban than the industrial
roof frame.
```

---

## קבוצה G — מתקנים נוספים

### IMG-21 · ליפט לרכב במוסך 🟡
**איפה:** `additional-lifting-equipment.md` hero · 4:3 · עדיפות 3
**ALT:** ליפט לרכב במוסך ומתקן הרמה ייעודי בקו ייצור

```
A two-post vehicle lift in a working garage with a car raised to head height,
its underside exposed. Tool trolley, coiled air line, oil-stained concrete.
Shot from below and to the side so the lift columns and arms read clearly.
28mm at f/6.3. Mixed light: fluorescent strips above, daylight from the open
roller door behind.
```

### IMG-22 · מתקן הרמה ייעודי בקו ייצור 🟡
**איפה:** `equipment.json`, `additional-lifting-equipment.md`, `lifting-equipment-inspection.md` · 21:9 + 4:3 · עדיפות 3
**ALT:** מתקן הרמה ייעודי המותקן בקו ייצור במפעל

```
A jib crane or dedicated lifting device mounted to a structural column on a
production line, its arm swung over a workstation. The angle deliberately shows
how the device is fixed to the building structure — bracket, bolts, column.
35mm at f/7.1. Even industrial lighting. The connection to the structure is
the subject, not the machine.
```

---

## קבוצה H — סביבה ומסמכים

### IMG-23 · אולם ייצור רחב עם כמה סוגי ציוד 🟢
**איפה:** `equipment.md` hero, מאמר `maintenance-manager-guide.md` · 4:3 · עדיפות 2
**ALT:** אולם ייצור עם עגורן גשר, מלגזה ובמת הרמה בשימוש

```
A wide view of a busy production hall in which three kinds of lifting equipment
appear together: a bridge crane overhead, a forklift crossing the floor, a
scissor lift parked against the far wall. Deep space, machinery, stacked
material, floor markings. 28mm at f/8 from an elevated position — a mezzanine
or stair landing. Skylight daylight mixed with high-bay lamps. Layered and
busy, but ordered.
```

### IMG-24 · סביבת מפעל כללית 🟢
**איפה:** `services.md` hero, `HomeWhy.astro` · 4:3 · עדיפות 2
**ALT:** בודק מוסמך בסביבת מפעל לצד ציוד הרמה

```
An inspector walking through a factory floor, seen from behind at a distance,
small in a large industrial space. Machinery on both sides, a crane rail
overhead. He is going somewhere, not posing. 35mm at f/5.6, low camera. Strong
directional daylight from a high window ahead of him, silhouetting his outline.
Scale and quiet competence.
```

### IMG-25 · תסקיר בדיקה על שולחן 🟡
**איפה:** `faq.md` hero, `lifting-equipment-inspection.md`, מאמר `what-is-certified-inspector.md`, `blog/index.astro` · 4:3 · **עדיפות 1**
**ALT:** תסקיר בדיקה חתום על שולחן לצד מסמכי ציוד הרמה

```
A printed multi-page inspection report lying on a desk, a pen resting across
it, an equipment file folder open beside it and a metal equipment ID plate
sitting on top of the papers. A laptop out of focus behind. Shot from above at
a slight angle, 50mm at f/5.6. Soft daylight from the side. Documents are
clearly forms — ruled fields, boxes, a signature line — but no readable words.
```
> **קריטי:** בקש מפורשות `no readable text, illegible document content`.
> טקסט מיוצר יוצא ג'יבריש, ומסמך רשמי עם ג'יבריש הוא הדבר הכי חושפני באתר.

### IMG-26 · אזור תעשייה במרכז 🟢
**איפה:** `lifting-inspection-center.md` hero · 4:3 · עדיפות 3
**ALT:** אזור תעשייה במרכז הארץ עם מחסנים לוגיסטיים ומלגזות בפעילות

```
An industrial estate in central Israel: a row of logistics warehouses with
loading docks, trucks backed up to two of them, forklifts moving pallets in the
apron. Mediterranean vegetation at the edges, other low industrial buildings
beyond. 35mm at f/8 from across the yard. Bright mid-morning light, clear sky,
dry ground.
```

### IMG-27 · מפעל תעשייה כבדה בדרום 🟢
**איפה:** `lifting-inspection-south.md` hero · 4:3 · עדיפות 3
**ALT:** מפעל תעשייה כבדה באזור הדרום עם עגורן ומתקני הרמה בחצר

```
A heavy-industry plant in the Israeli south seen across its open yard: steel
structures, pipework, a gantry crane, stacked raw material. Arid ground, dust
in the air, desert ridgeline in the far distance. 35mm at f/9. Hard midday
sun, bleached pale sky, hot flat light, hard-edged shadows. Big, dry, exposed.
```

---

## סדר עבודה מומלץ

**גל 1 — 6 תמונות שנותנות 70% מהכיסוי** (מופיעות במספר עמודים):
IMG-04 עגורן כללי · IMG-09 מלגזה כללית · IMG-16 אביזרי הרמה · IMG-18 קו חיים ·
IMG-25 תסקיר · IMG-01 hero

**גל 2 — heroes של עמודי השירות והציוד:** IMG-02, 05, 10, 13, 21, 23, 24

**גל 3 — מקרו ואזוריות:** השאר

## אחרי שיש תמונות

```bash
# המרה ודחיסה
cwebp -q 82 -resize 1600 0 source.jpg -o public/uploads/img-04-crane-hall.webp
```

בעריכת התוכן ב-CMS, הוסיפו לבלוק שדה `image` עם הנתיב `/uploads/img-04-crane-hall.webp`.
`PhotoFrame` מחליף אוטומטית מ-placeholder ל-`<img>` אמיתי — שום שינוי אחר לא נדרש.

**אל תמחקו את שדה ה-`alt`.** הוא כבר כתוב נכון לכל תמונה ברשימה הזאת, והוא מה
שקורא מסך מקריא ומה שגוגל קורא.
