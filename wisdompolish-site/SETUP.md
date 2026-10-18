# WisdomPolish – Setup (සිංහල)

මෙතන ඇති සියල්ල ෆ්‍රී. පියවර එකින් එක කරන්න. (මෙනු නම් ටිකක් වෙනස් වෙන්න පුළුවන්.)

## 1. GitHub එකේ ෆයිල් දාන්න
1. github.com ගිණුමක් හදන්න. "New repository" එකක් හදන්න (නම: wisdompolish).
2. මේ zip එක unzip කරන්න. ඇතුළේ තියෙන `functions` සහ `public` ෆෝල්ඩර් දෙකයි `schema.sql` ෆයිල් එකයි repository එකට "Add file → Upload files" වලින් දාන්න.

## 2. Cloudflare එකේ database එක හදන්න
1. dash.cloudflare.com ගිණුමක් හදන්න.
2. Storage & Databases → D1 → "Create database". නම: `wisdompolish`.
3. ඒකේ "Console" ටැබ් එකට ගිහින් `schema.sql` ෆයිල් එකේ අකුරු ඔක්කොම paste කරලා Execute ඔබන්න.

## 3. සයිට් එක හදන්න
1. Workers & Pages → Create → Pages → Connect to Git. ඔබේ repository එක තෝරන්න.
2. Build command හිස්ව තියන්න. Build output directory: `public`. Deploy ඔබන්න.
3. Deploy වුණාම Settings → Bindings → Add → D1 database. Variable name: `DB`. Database: `wisdompolish`.
4. Settings → Variables and secrets → Add:
   - `ADMIN_PASSWORD` = ඔබේ දිගු රහස් පාස්වර්ඩ් එක (අකුරු 16+)
   - `SITE_URL` = ඔබේ සයිට් ලිපිනය (උදා: https://wisdompolish.pages.dev)
5. Deployments → Retry deployment (අලුත් settings වැඩ කරන්න).

## 4. පාවිච්චි කිරීම
- සයිට් එක: `ඔබේ-ලිපිනය/`
- Admin: `ඔබේ-ලිපිනය/admin/` → පාස්වර්ඩ් එකෙන් ඇතුල් වී Write ටැබ් එකෙන් ලිපි දාන්න.
- Comments: ඕනෑම කෙනෙක්ට දාන්න පුළුවන්. Admin → Comments වලින් Approve කළාම විතරක් පේනවා.

## 5. Google Search
Google Search Console (search.google.com/search-console) → ඔබේ සයිට් ලිපිනය add කරන්න → Sitemaps → `sitemap.xml` ඇතුළත් කරන්න.

## 6. ආදායම
- **Google AdSense**: AdSense ගිණුමකට apply කරන්න (ලිපි ටිකක් තියෙන්න ඕන, Google අනුමත කරන්න ඕන). අනුමත වුණාම Cloudflare variables වලට `ADSENSE_CLIENT` (ca-pub-...) සහ `ADSENSE_SLOT` (ad unit අංකය) දාන්න. එතකොට ලිපි තුළ ඉබේම දැන්වීම් පෙනෙනවා.
- **Affiliate links**: ලිපියක https:// link එකක් ලිව්වාම ඉබේම link එකක් වෙනවා (rel="sponsored" සහිතව).
- **Email list**: Admin → Subscribers වලින් CSV එකක් බාගත කරන්න පුළුවන්.
- EU/UK අයට ads පෙන්වන්න consent banner එකක් Google ඉල්ලනවා. AdSense දාන්න කලින් ඒක බලන්න. privacy පිටුව (`functions/privacy.js`) ඔබේම තොරතුරු වලට වෙනස් කරගන්න.

