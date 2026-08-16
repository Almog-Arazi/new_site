# Regulatory review — claims awaiting sign-off

Every professional, legal or regulatory claim the site makes, in one place, so
it can be approved or corrected before launch rather than after.

Both review rounds are explicit about this: **nothing here goes live without the
client's approval.** Round one §20 and round two §13.

This site tells maintenance managers and safety officers how often their
equipment must be inspected, who may inspect it, and what happens when it is
not. A wrong number on a page like that is not a typo.

## How to use this file

One row per claim. Change **סטטוס** to `מאושר` once the client confirms the
wording, or write the correction in **הערות** and the row stays open.

Nothing ships while a row it depends on is still `ממתין לאישור`. Where a claim
is uncertain, the honest options are: cut the number and describe the principle,
or attribute it explicitly to the standard it comes from.

**Status legend:** `ממתין לאישור` · `מאושר` · `לתיקון`

---

## 1. Inspection frequency

The highest-risk group on the site. Every figure below is currently stated as
fact, in the site's own voice.

| # | Claim | Where | סטטוס | הערות |
|---|---|---|---|---|
| 1.1 | מכונות ומתקני הרמה — בדיקה תקופתית **אחת ל־14 חודשים** ברוב המקרים | `faq/general.json:9` | ממתין לאישור | |
| 1.2 | מלגזה — **אחת ל־14 חודשים** | `faq/forklifts.json:9`, `faq/general.json:34` | ממתין לאישור | |
| 1.3 | אביזרי הרמה — בדיקה יסודית **אחת ל־6 חודשים** | `faq/forklifts.json:16`, `faq/general.json:41` | ממתין לאישור | |
| 1.4 | עגורן גשר — **אחת ל־14 חודשים**, לפי פקודת הבטיחות בעבודה | `faq/bridge-cranes.json:9` | ממתין לאישור | הציטוט לפקודה מופיע במפורש — לאשר גם את ההפניה עצמה |
| 1.5 | עגורן שער — **אחת ל־14 חודשים**, לפי פקודת הבטיחות בעבודה | `faq/gantry-cranes.json:9` | ממתין לאישור | |
| 1.6 | עגורן זרוע — **אחת ל־14 חודשים**, לפי פקודת הבטיחות בעבודה | `faq/jib-cranes.json:9` | ממתין לאישור | |
| 1.7 | דופן הרמה אחורית — **אחת ל־14 חודשים** | `faq/tail-lifts.json:9` | ממתין לאישור | |
| 1.8 | במת הרמה — **אחת ל־14 חודשים** ולפני שימוש ראשון | `faq/platforms.json:9` | ממתין לאישור | |
| 1.9 | במת הרמה באתר בנייה — **אחת ל־6 חודשים** | `faq/platforms.json:16` | ממתין לאישור | תדירות שונה לפי סביבת העבודה — לוודא שההבחנה מדויקת |
| 1.10 | טבלת תדירות לפי סוג ציוד | `pages/equipment.md:32` | ממתין לאישור | טבלה שלמה, לא שורה אחת — לעבור עליה כולה |

## 2. Who may inspect

| # | Claim | Where | סטטוס | הערות |
|---|---|---|---|---|
| 2.1 | רק בודק מוסמך בעל הסמכה **מטעם משרד העבודה** רשאי לבצע בדיקות ולהפיק תסקיר | `faq/inspector.json:9` | ממתין לאישור | שם הגוף המסמיך נקוב במפורש — לוודא שהוא הנכון והעדכני |
| 2.2 | כל תוכן עמוד "מהו בודק מוסמך" | `articles/what-is-certified-inspector.md` | ממתין לאישור | |

## 3. What a תסקיר is

| # | Claim | Where | סטטוס | הערות |
|---|---|---|---|---|
| 3.1 | התסקיר **מתעד** את הבדיקה, פרטי הציוד, הממצאים, ליקויים והמסקנות | `faq/inspector.json:9` ועוד עשרה קבצי FAQ | ממתין לאישור | הנוסח כבר אחיד בכל האתר |
| 3.2 | תוקן: התסקיר "מאשר את תוצאות הבדיקה" → "מתעד…" | `articles/what-is-certified-inspector.md:67` | לתיקון — בוצע | היה הניסוח היחיד באתר שטען לאישור. שאר המופעים של "מאשר" הם מילת השוואה ("מהר יותר מאשר") ואינם קשורים |
| 3.3 | שימוש בציוד ללא בדיקה נדרשת "עלול ליצור חשיפה בטיחותית, משפטית וביטוחית" | `faq/general.json:48` | ממתין לאישור | טענה משפטית — לאשר או לרכך |

## 4. Preparation, scope, and consequences

| # | Claim | Where | סטטוס | הערות |
|---|---|---|---|---|
| 4.1 | ללא תסקיר בתוקף **לא ניתן לגשת לטסט** (דופן הרמה) | `faq/tail-lifts.json:37` | ממתין לאישור | טענה תפעולית מול רשות הרישוי |
| 4.2 | מה נדרש להכין לקראת בדיקה | `faq/preparation.json:23` | ממתין לאישור | |
| 4.3 | בדיקה לפני שימוש ראשון בציוד חדש | `faq/new-equipment.json` | ממתין לאישור | הקובץ כולו |
| 4.4 | בדיקה לאחר תיקון או שינוי משמעותי | `faq/general.json:9` | ממתין לאישור | |

## 5. Not yet written — do not publish before approval

| # | Subject | Where it will land | סטטוס |
|---|---|---|---|
| 5.1 | כל תוכן מקצועי במאמרים שייכתבו מחדש | `articles/*.md` | ממתין לאישור |
| 5.2 | מתי ציוד אינו רשאי להמשיך בשימוש / פסילת ציוד | לא קיים באתר כרגע | ממתין להחלטה — האם בכלל לכתוב |
| 5.3 | תקופת שמירת תסקירים | לא קיים באתר כרגע | ממתין להחלטה |

---

## Open questions for the client

1. **14 חודשים** appears as the periodic interval for six different equipment
   types. Is it the same figure for all of them, or has one been copied across?
2. **6 חודשים** appears for lifting accessories and for platforms on
   construction sites. Two different bases for the same number — both correct?
3. Three FAQ answers cite **פקודת הבטיחות בעבודה** by name. Cite it, or say
   "הדרישות הרלוונטיות" and keep the specific reference off the page?
4. **משרד העבודה** is named as the certifying body. Current and correct?
5. Item 4.1 — is "ללא תסקיר בתוקף לא ניתן לגשת לטסט" accurate as stated?
6. Items 5.2 and 5.3 — worth covering at all, or better left off the site?
