# משימה: Public Jobs API למערכת Hiro

**עבור:** ניר
**מטרה:** להציג את המשרות הפתוחות ממערכת Hiro באתר hiro.co.il (ובהמשך גם ב-humand.co.il), ברמה שמתחרה ב-AllJobs, JobMaster ודרושים: חיפוש מהיר, סינון לפי תחום, אזור והיקף, עמוד משרה מלא שמופיע ב-Google for Jobs, והגשת מועמדות ישירה למערכת.

**מצב נוכחי:** ב-Agent API אין endpoint למשרות, ו-`/api/jobs` חסום לסוכנים. זה גם לא הערוץ הנכון: ה-Agent API דורש התחברות ומיועד לכתיבה. לאתר ציבורי צריך API נפרד: **קריאה בלבד** למשרות, ו-endpoint אחד של **כתיבה** להגשת מועמדות.

הפרונט כבר נבנה מול החוזה שבמסמך הזה (`lib/jobs/types.ts` בריפו של האתר). אם משנים שם של שדה, תעדכן אותי ואתאים.

---

## 1. עקרונות

1. **Namespace נפרד:** `/api/public/v1/*`, בלי JWT של משתמש או סוכן.
2. **אימות שרת-לשרת:** האתר קורא ל-API מהשרת (Next.js), לא מהדפדפן. כל אתר מקבל מפתח משלו בכותרת `X-Hiro-Site-Key`. המפתח נשמר כ-env ב-Vercel ולא נחשף לגולש.
3. **Multi-tenant מהיום הראשון:** המפתח קובע איזה אתר קורא ואילו משרות הוא רואה.
   - `hiro.co.il` רואה את כל המשרות שסומנו לפרסום ב-Hiro.
   - `humand.co.il` רואה רק את המשרות של Humand.
4. **רק משרות שסומנו לפרסום:** צריך שדה חדש במשרה, `publishOnSite` (בוליאני), ושדה `publishedAt`. משרה שלא סומנה לא חוזרת מה-API בשום מצב.
5. **אנונימיות לקוח:** משרדי השמה לרוב לא חושפים את הלקוח. צריך שדה `isClientConfidential`. כשהוא `true`, ה-API **לא מחזיר** את שם הלקוח, הלוגו או ה-id שלו, אלא רק תיאור כללי שהמגייס כותב (`displayCompanyName`, למשל "חברת הייטק מובילה במרכז").
6. **Allowlist של שדות:** בשום מקרה לא חוזרים שדות פנימיים: שכר שהוצע ללקוח, עמלות, הערות פנימיות, אנשי קשר אצל הלקוח, מועמדים שהוגשו, embeddings או משקלות ההתאמה.
7. **ביצועים:** תשובת רשימה מתחת ל-300ms. ה-API צריך לתמוך ב-`ETag`/`If-None-Match`. האתר שומר cache של 5 דקות ומתרענן ב-webhook (סעיף 6).

---

## 2. Endpoints

| Method | Path | תיאור |
|---|---|---|
| GET | `/api/public/v1/jobs` | רשימת משרות עם חיפוש, סינון, מיון, עימוד ו-facets |
| GET | `/api/public/v1/jobs/:slugOrId` | משרה בודדת, מלאה |
| GET | `/api/public/v1/jobs/:id/similar?limit=6` | משרות דומות (אפשר מ-embeddings הקיימים) |
| GET | `/api/public/v1/taxonomy` | כל הרשימות לסינון: תחומים, ערים ואזורים, היקפים, ותק |
| GET | `/api/public/v1/sitemap/jobs` | רשימה רזה לכל המשרות הפעילות (`slug`, `updatedAt`) עבור ה-sitemap |
| POST | `/api/public/v1/jobs/:id/applications` | הגשת מועמדות עם קובץ קורות חיים |

### 2.1 `GET /jobs`: פרמטרים

| Param | סוג | דוגמה | הערות |
|---|---|---|---|
| `q` | string | `מנהלת חשבונות` | חיפוש חופשי בכותרת, בתיאור, בכישורים ובשם החברה. **חשוב:** להשתמש בסינונימים של קטלוג התגיות, כך ש"הנהלת חשבונות" ימצא גם "מנהל/ת חשבונות". אם אפשר, גם חיפוש וקטורי |
| `category` | string (slug), ניתן לחזרה | `finance` | תחום ראשי |
| `subcategory` | string (slug), ניתן לחזרה | `bookkeeping` | תת-תחום |
| `city` | string (slug), ניתן לחזרה | `tel-aviv` | עיר מקטלוג הערים |
| `region` | string (slug), ניתן לחזרה | `center` | אזור (צפון, חיפה והקריות, שרון, מרכז, ירושלים, שפלה, דרום, יהודה ושומרון) |
| `near` | `lat,lng` | `32.08,34.78` | חיפוש לפי מרחק (רדיוס ב-`radiusKm`, ברירת מחדל 25) |
| `employmentType` | enum, ניתן לחזרה | `full_time` | ראו סעיף 3 |
| `workModel` | enum, ניתן לחזרה | `hybrid` | `onsite` / `hybrid` / `remote` |
| `seniority` | enum, ניתן לחזרה | `mid` | `entry` / `junior` / `mid` / `senior` / `lead` / `manager` / `executive` |
| `noExperience` | boolean | `true` | "ללא ניסיון", פילטר פופולרי מאוד ברשתות |
| `suitableFor` | enum, ניתן לחזרה | `students` | `students` / `soldiers` / `pensioners` / `disability` / `olim` |
| `salaryMin` | number | `12000` | ש"ח לחודש. משרות בלי שכר מפורסם לא נפסלות |
| `postedWithin` | enum | `7d` | `1d` / `3d` / `7d` / `30d` |
| `companyId` | uuid | | רק לחברה לא אנונימית |
| `sort` | enum | `relevance` | `relevance` (ברירת מחדל כשיש `q`) / `newest` (ברירת מחדל) / `salary` / `distance` |
| `page`, `limit` | number | `1`, `20` | `limit` עד 50 |
| `facets` | boolean | `true` | להחזיר ספירות לכל ערך פילטר (סעיף 2.2) |

פרמטר שחוזר מאפשר בחירה מרובה: `?city=tel-aviv&city=ramat-gan` (OR בתוך פילטר, AND בין פילטרים).

### 2.2 תשובת רשימה

```json
{
  "data": [ JobSummary, ... ],
  "total": 412,
  "page": 1,
  "limit": 20,
  "totalPages": 21,
  "facets": {
    "category":       [{ "value": "finance", "label": "כספים וחשבונאות", "count": 48 }],
    "city":           [{ "value": "tel-aviv", "label": "תל אביב-יפו", "count": 131 }],
    "region":         [{ "value": "center", "label": "מרכז", "count": 210 }],
    "employmentType": [{ "value": "full_time", "label": "משרה מלאה", "count": 300 }],
    "workModel":      [{ "value": "hybrid", "label": "היברידי", "count": 77 }],
    "seniority":      [{ "value": "mid", "label": "ניסיון בינוני", "count": 120 }]
  }
}
```

**facets** הן מה שהופך את הממשק לרמה של הרשתות הגדולות: ליד כל אפשרות סינון מופיע מספר המשרות. הספירה מחושבת על התוצאות **בלי הפילטר של אותה קבוצה** (disjunctive faceting), כדי שאפשר יהיה לבחור כמה ערים ולראות כמה יש בכל אחת.

---

## 3. מבנה המשרה

### `JobSummary` (ברשימה)

| שדה | סוג | חובה | הערות |
|---|---|---|---|
| `id` | uuid | ✓ | |
| `slug` | string | ✓ | יציב ו-URL-friendly. אם הוא בעברית, רק עם מקפים. דוגמה: `menahel-at-heshbonot-sug-3-petah-tikva-4821`. **לא משתנה** כשמעדכנים כותרת (ה-id בסוף מבטיח ייחודיות) |
| `jobNumber` | string | ✓ | מספר משרה קצר לתצוגה ("משרה 4821"). מועמדים מצטטים אותו בטלפון |
| `title` | string | ✓ | כותרת לתצוגה, כמו שהמגייס כתב |
| `normalizedRoleTagId` | uuid | | תגית התפקיד מקטלוג התגיות (type=`role`). משמש למשרות דומות ולקיבוץ |
| `company` | `PublicCompany` | ✓ | ראו למטה. כשהלקוח אנונימי: `{ "confidential": true, "displayName": "..." }` |
| `category` | `{slug,label}` | ✓ | תחום ראשי |
| `subcategory` | `{slug,label}` | | |
| `locations` | `JobLocation[]` | ✓ | לפחות אחד, אלא אם `workModel=remote` |
| `employmentType` | enum[] | ✓ | `full_time`, `part_time`, `shifts`, `temporary`, `freelance`, `internship`, `student` (מערך: משרה יכולה להיות גם מלאה וגם במשמרות) |
| `workModel` | enum | ✓ | `onsite` / `hybrid` / `remote` |
| `seniority` | enum | | |
| `experienceYearsMin` | number | | `0` פירושו ללא ניסיון |
| `salary` | `Salary` | | רק אם המגייס בחר לפרסם |
| `teaser` | string | ✓ | 1–2 שורות (עד 180 תווים) לכרטיס ברשימה. אפשר לייצר אוטומטית מהתיאור |
| `skills` | `{tagId,label}[]` | | עד 8, מקטלוג התגיות (type=`skill`) |
| `tags` | enum[] | | תגיות שיווקיות: `urgent` (דחוף), `hot` (חמה), `new` (פחות מ-48 שעות), `no_experience`, `students`, `relocation` |
| `publishedAt` | ISO | ✓ | תאריך הפרסום באתר (לא תאריך פתיחת המשרה במערכת) |
| `updatedAt` | ISO | ✓ | |
| `validThrough` | ISO | | עד מתי המשרה פתוחה. חובה ל-Google for Jobs אם ידוע |

### `JobDetail` (עמוד משרה) = `JobSummary` + השדות הבאים

| שדה | סוג | חובה | הערות |
|---|---|---|---|
| `description` | `RichText` | ✓ | על התפקיד. HTML מסונן (רק `p`, `ul`, `ol`, `li`, `strong`, `em`, `br`, `h3`) או Markdown |
| `responsibilities` | string[] | | תחומי אחריות, כרשימה |
| `requirements` | string[] | ✓ | דרישות חובה |
| `niceToHave` | string[] | | יתרון |
| `benefits` | string[] | | תנאים והטבות (למשל "קרן השתלמות", "חניה", "ארוחות") |
| `education` | `{ level, field? }` | | `level`: `none` / `high_school` / `certificate` / `bachelor` / `master` / `phd` |
| `languages` | `{ language, level }[]` | | למשל `{ "language": "en", "level": "high" }` |
| `drivingLicense` | `{ required: boolean, type?: "B"\|"C1"\|"C"\|"E" }` | | |
| `requiresCar` | boolean | | |
| `hoursDescription` | string | | למשל "א׳–ה׳ 08:00–17:00" |
| `startDate` | `"immediate"` \| ISO | | |
| `positionsCount` | number | | מספר תקנים |
| `recruiter` | `{ displayName, title?, photoUrl? }` | | המגייס/ת האחראי/ת. רק שם פרטי ותמונה, **בלי טלפון או מייל** |
| `apply` | `ApplyConfig` | ✓ | ראו סעיף 4 |
| `seo` | `{ title?, description? }` | | דריסה ידנית לכותרת ותיאור בגוגל (לא חובה) |
| `status` | `"open"` \| `"closed"` | ✓ | משרה שנסגרה חוזרת עם `closed` ל-30 יום (סעיף 5) |

### `PublicCompany`

| שדה | סוג | הערות |
|---|---|---|
| `confidential` | boolean | |
| `id` | uuid | רק כשלא אנונימי. ה-id של ה-Organization מהקטלוג |
| `name` | string | כשלא אנונימי. `name` מה-Organization |
| `displayName` | string | כשאנונימי. תיאור גנרי שהמגייס כותב |
| `logoUrl` | string | `logo` מה-Organization. URL ציבורי ב-HTTPS, רצוי ריבועי ומינימום 200×200 |
| `website` | string | |
| `industry` | string | `mainField` + `subField` מה-Organization |
| `sizeRange` | string | מ-`employeeCount`, למשל `"51-200"` |
| `about` | string | `description` מה-Organization, קצר |
| `hq` | string | `location` מה-Organization |

> **שימוש בקטלוג הקיים:** כל שדות החברה כבר קיימים ב-Organization (שם, לוגו, תחום ותת-תחום, גודל, אתר, תיאור, מיקום). רוב העבודה כאן היא חיבור משרה ללקוח, ולקוח ל-Organization (`organization-link` כבר קיים).

### `JobLocation`

```json
{ "citySlug": "petah-tikva", "cityName": "פתח תקווה", "regionSlug": "center", "regionName": "מרכז",
  "address": "רח׳ אבא הלל 12", "lat": 32.0871, "lng": 34.8875 }
```

ערים מקטלוג הערים הקיים (אותו catalog שמוולד ב-`location` של Organization). כל עיר משויכת לאזור. `address` הוא אופציונלי וחוזר רק אם המגייס סימן "להציג כתובת".

### `Salary`

```json
{ "min": 12000, "max": 15000, "currency": "ILS", "period": "month", "isEstimate": false }
```

`period`: `hour` / `month` / `year`. אפשר לשלוח רק `min` או רק `max`.

---

## 4. הגשת מועמדות

### `ApplyConfig` (בתוך `JobDetail`)

```json
{
  "method": "hiro",
  "requiresCv": true,
  "questions": [
    { "id": "q1", "type": "yes_no", "label": "האם יש לך ניסיון עם Priority?", "required": true },
    { "id": "q2", "type": "text", "label": "ציפיות שכר", "required": false }
  ],
  "externalUrl": null
}
```

- `method`: `hiro` (טופס באתר שנשמר ב-Hiro) או `external` (הפניה ל-`externalUrl`).
- `questions` (שאלות סינון): `type` הוא אחד מ-`yes_no`, `text`, `number` או `select` (עם `options`).

### `POST /jobs/:id/applications`

`multipart/form-data`, נקרא מהשרת של האתר (לא מהדפדפן):

| שדה | חובה | הערות |
|---|---|---|
| `fullName` | ✓ | |
| `phone` | ✓ | נרמול לפורמט ישראלי |
| `email` | | |
| `cv` | לפי `requiresCv` | PDF / DOC / DOCX, עד 5MB |
| `answers` | | JSON: `{ "q1": "yes", "q2": "13000" }` |
| `consent` | ✓ | `true`. הסכמה למדיניות הפרטיות ולשמירת הפרטים |
| `source` | ✓ | `hiro.co.il` / `humand.co.il` (נקבע אוטומטית לפי המפתח) |
| `utm` | | JSON עם utm_source / utm_medium / utm_campaign, למדידת ערוצים |

**מה המערכת עושה:**
1. מחפשת מועמד קיים לפי טלפון או מייל. אם יש, מצרפת אותו ומעדכנת קורות חיים. אם אין, יוצרת מועמד חדש (עם הפרסור הקיים של קורות חיים).
2. משייכת את המועמד למשרה בסטטוס "מועמד חדש (לסינון)", עם מקור גיוס "אתר Hiro" או "אתר Humand".
3. מחזירה `201 { "applicationId": "...", "candidateCreated": true }`.
4. אם המועמד כבר הגיש למשרה הזו: `409 { "code": "ALREADY_APPLIED" }`, והאתר מציג "כבר הגשת למשרה הזו".
5. **הגנות:** rate limit לפי IP ולפי טלפון (האתר מעביר `X-Forwarded-For`), ובדיקת סוג קובץ אמיתית (לא רק לפי הסיומת).

> **בהמשך:** "הגשה בלחיצה" למועמד שמחובר לאפליקציה (עם הפרופיל הקיים). זה דורש SSO בין האתר ל-app.hiro.co.il. לא נדרש לשלב הראשון.

---

## 5. משרות שנסגרות (קריטי ל-SEO)

- משרה שנסגרה או ירדה מפרסום **לא נעלמת** מיד. `GET /jobs/:slug` ממשיך להחזיר אותה עם `status: "closed"` למשך 30 יום. האתר מציג "המשרה אוישה" עם משרות דומות, ומסיר אותה מ-Google for Jobs (Google דורש את זה).
- אחרי 30 יום: `410 Gone`.
- משרה שאיננה בכלל: `404`.

---

## 6. Webhook לרענון מיידי

כדי שמשרה חדשה תופיע באתר תוך שניות ולא תוך 5 דקות:

`POST https://hiro.co.il/api/revalidate` עם כותרת `X-Hiro-Signature` (HMAC-SHA256 של ה-body עם secret משותף):

```json
{ "event": "job.published" | "job.updated" | "job.closed", "jobId": "uuid", "slug": "...", "site": "hiro.co.il" }
```

לשלוח בכל פרסום, עדכון או סגירה של משרה שמסומנת `publishOnSite`. בצד האתר זה כבר מוכן לקבל.

---

## 7. `GET /taxonomy`

```json
{
  "categories": [
    { "slug": "finance", "label": "כספים וחשבונאות", "count": 48,
      "subcategories": [{ "slug": "bookkeeping", "label": "הנהלת חשבונות", "count": 31 }] }
  ],
  "regions": [
    { "slug": "center", "label": "מרכז", "count": 210,
      "cities": [{ "slug": "petah-tikva", "label": "פתח תקווה", "count": 22, "lat": 32.08, "lng": 34.88 }] }
  ],
  "employmentTypes": [{ "value": "full_time", "label": "משרה מלאה" }],
  "seniorities": [{ "value": "mid", "label": "ניסיון בינוני (3–5 שנים)" }]
}
```

- **תחומים:** מומלץ עץ של 20–30 תחומים ראשיים עם תתי-תחומים, בדומה לרשתות הגדולות. אם כבר קיים מיפוי תחומים ב-Hiro (`mainField`/`subField` ב-Organization, או תגיות `role`), להשתמש בו. ה-slug חייב להיות **יציב**, כי הוא חלק מכתובות ה-SEO של האתר (`/jobs/finance/tel-aviv`).
- **ערים:** מקטלוג הערים הקיים, עם שיוך לאזור ו-lat/lng.
- `count`: רק משרות פעילות שמסומנות לפרסום, לפי האתר של המפתח.

---

## 8. מה צריך להוסיף במסך המשרה ב-Hiro (UI למגייס)

בטאב חדש בשם "פרסום באתר":

- [ ] מתג **פרסם באתר** (`publishOnSite`), ובחירת אתרים (Hiro / Humand), אם רלוונטי
- [ ] **לקוח אנונימי** (`isClientConfidential`) + שדה "שם תצוגה"
- [ ] **כותרת לפרסום** (ברירת מחדל: שם המשרה)
- [ ] **תחום ותת-תחום** (מהעץ)
- [ ] **עיר או ערים** + "להציג כתובת"
- [ ] היקף משרה (בחירה מרובה), מודל עבודה (משרד / היברידי / מהבית), ותק, "ללא ניסיון", "מתאים ל..."
- [ ] **שכר**: טווח + "פרסם שכר" (כבוי כברירת מחדל)
- [ ] תיאור, תחומי אחריות, דרישות, יתרון, הטבות. כפתור **"נסח בעזרת AI"** שממלא את כל אלה מהמשרה הפנימית יחסוך המון זמן
- [ ] **שאלות סינון** (אופציונלי)
- [ ] **תוקף**: `validThrough` (ברירת מחדל: 30 יום)
- [ ] **תצוגה מקדימה** של עמוד המשרה כמו שייראה באתר

---

## 9. סדר עדיפויות מוצע

| שלב | מה | למה |
|---|---|---|
| 1 | `GET /jobs` (בלי facets) + `GET /jobs/:slug` + `publishOnSite` + אנונימיות | אפשר לעלות לאוויר עם משרות אמיתיות |
| 2 | `POST /applications` | בלי זה המועמד נשלח לטופס חיצוני |
| 3 | `facets` + `GET /taxonomy` + חיפוש עם סינונימים | חוויית סינון כמו בגדולים |
| 4 | Webhook + `sitemap/jobs` + סגירה ב-`closed`/`410` | SEO ו-Google for Jobs |
| 5 | `similar`, `near` (מרחק), הגשה בלחיצה | שיפורים |

---

## 10. בדיקות קבלה

- [ ] משרה שלא סומנה `publishOnSite` לא מופיעה ברשימה ומחזירה 404 גם בגישה ישירה
- [ ] משרה עם לקוח אנונימי: אין `company.id`, `name` או `logoUrl` בשום endpoint, כולל `similar`
- [ ] מפתח של Humand לא רואה משרות של לקוחות אחרים
- [ ] `q=הנהלת חשבונות` מוצא משרה שהכותרת שלה "מנהל/ת חשבונות"
- [ ] facet counts נכונים כשבוחרים שתי ערים
- [ ] הגשה עם טלפון של מועמד קיים לא יוצרת כפילות
- [ ] הגשה שנייה לאותה משרה מחזירה 409
- [ ] משרה שנסגרה מחזירה `status: closed`, ואחרי 30 יום 410
- [ ] אין שדות פנימיים בשום תשובה (לבדוק מול allowlist)
