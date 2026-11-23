# PlayboxTV: product and TV context

Read this to understand what is being prototyped. It is background for prototyping decisions, not a design spec: the designer's Figma file always wins.

## Contents
1. The product
2. Plans, locks and CTAs
3. Content types
4. TV-specific differences
5. Visual tokens seen in the TV designs
6. The Home module (first module built)

## 1. The product
PlayboxTV is an Indian OTT aggregator. It bundles JioHotstar, SonyLIV, ZEE5, Sun NXT, Chaupal, ShortsTV and other streaming platforms into a single subscription and one app, on mobile, web, tablet and TV. It also carries live TV channels (Colors, Aaj Tak, CNN, Asianet, Sun TV, HBO, Star Movies, Zee TV, Discovery, Nat Geo Wild and more).

- **Home and discovery:** hero carousel, "Explore by OTTs" row that filters by platform, Continue Watching, Top 10 rails, genre rails, upcoming releases, premium live channels. Roughly 80-90% of what is shown comes from OTTs in the user's plan.
- **Playback:** titles play inside PlayboxTV, or redirect to the partner OTT app via single sign-on. If a title exists in several languages across OTTs the user picks language and platform first.
- **Details pages:** trailer autoplays as backdrop. The main button depends on state: Login to watch, Subscribe to watch, Upgrade, Watch Now, Continue Watching S1:E3. Also episodes by season, More Like This, cast and details.
- **Player:** speed, quality, audio, subtitles, rate (Like / Not for me / Love), report an issue, next-episode autoplay, cast, lock controls (picture-in-picture on mobile only).
- **Upcoming:** reminders; titles dropping within 24 hours can show a countdown. Reminders work in-app even if notification permission is declined.
- **Onboarding:** phone + OTP login (QR code on web and TV), up to 5 profiles including Kids, language and genre preferences.
- **Engagement:** watchlist, ratings, content tags (New Movie, New Episode, Trending, Top 10, Free), up to 3 ads on Home.

## 2. Plans, locks and CTAs
- Tiers run from logged-out up to the top **Maharaja** plan, starting at **₹99/month**. Plan cards in the TV drawer showed "Maharaja MAX ₹499/month" and "Ultimate Super Value ₹279/month" (4 devices, auto-renews, "30 OTTs + Vouchers").
- **User states** drive the screen variants: *not logged in*, *logged in but unsubscribed*, *subscribed*. Each can have its own page (e.g. a Watchlist rail only for logged-in users, Continue Watching only for users with history).
- **Locks:** content outside the plan shows a lock badge. In reality some titles are locked and some unlocked depending on the plan; sometimes a whole OTT rail ("Trending on SonyLiv") is all locked or all unlocked. A designer's static frame often shows every card locked: that is a placeholder, not the rule (confirm).
- OK on a locked title opens the subscription drawer (QR code + plans) in the prototype.

## 3. Content types
Movies, shows, pre-recorded and live sports, live TV channels, and **Streams**.
- **Streams** are looped movies/episodes served like a live TV channel: viewers cannot seek, ads play between items. On TV, a focused stream card starts playing inside the card immediately ("Currently Playing"), and OK would open full playback.
- Live content carries a **Live** badge; non-live content does not.
- Tags seen on TV cards: "New Movie", "Recently Added", date tags on upcoming cards ("This Friday", "28th Nov").

## 4. TV-specific differences (designer notes)
- TV is 1920x1080, **D-Pad driven, no scrolling**; everything is a focus state.
- Streams get more importance on TV (placed higher).
- A **Genre** rail exists on TV only, to jump quickly to a genre; it can move higher if upper sections are irrelevant.
- An **Upcoming on PlayboxTV** rail exists on TV only (set a reminder from the card).
- A **QR code** lets the user scan to explore subscription plans (TV cannot take payments).
- Rails that are partly visible above or below the focused rail are dimmed under a gradient so emphasis stays on the focused section.
- Long-press OK on a card opens a side menu (More Details, Don't Like, Like, Love, Add to watchlist).

## 5. Visual tokens seen in the TV designs
Always re-read tokens from the Figma file (`get_variable_defs`), these are only a sanity check.
- Fonts: **Zalando Sans** (body) and **Zalando Sans SemiExpanded** (titles/CTAs), available on Google Fonts; ship the latin woff2 locally.
- Page background `#111111`; text white; secondary text `#d6d6d7`; disabled `#6e6e6f`.
- Primary CTA: crimson `#5e0405` with a red glow (`#e34242`), 72px tall, radius 16; secondary CTA translucent grey `rgba(125,125,125,.2)`.
- Focus ring: white 3px outline with a red glow underneath; focused cards scale up (about 1.2-1.36x).
- Sidebar: 128px, icon-only (profile, search, home, library), active item is a crimson rounded square.

## 6. The Home module (first module built)
Rail order used for the Home demo (logged-in, unsubscribed user, plus Continue Watching): hero carousel; Explore by OTTs (+ a rail that changes per OTT); Continue Watching (mixed portrait and landscape cards); Top Picks For You; Non-Stop Hindi Movies (Streams); From your Watchlist; a featured-collection spotlight (Godzilla); Genre; Upcoming on PlayboxTV; Action Adventure; subscription banner with QR; sports highlight rails (Live badges); Comedy Flicks; "Trending on <OTT>" rails (all locked or all unlocked); Premium Live Channels (logos only); more Streams; sitcoms, slow burns, romance, binge, FIFA, Malayalam rails.

Behaviours specified by the designer for Home are summarised in `04-layout-and-focus-engine.md` (section "Home special cases"). Other modules (Details, Player, Search, Live TV, Library...) will have their own screens and focus states; use the same engine and the same intake.
