// 
// GOOGLE ANALYTICS 4 — the whole site reads from this one file.
// 
// Paste your Measurement ID on the line below and both pages start reporting.
// Find it in Google Analytics → Admin → Data streams → your web stream →
// "Measurement ID". It looks like: G-XXXXXXXXXX
// 
// What you get once it is set:
//   • Which pages visitors view — Reports → Engagement → Pages and screens
//     (index.html is reported as "/", the youth page as "/youth.html").
//   • Where they come from — Reports → Acquisition → Traffic acquisition.
//     GA reads the referring site, the search engine, or a campaign tag in the
//     URL on its own; no extra code is needed for that.
//   • Enhanced measurement (outbound clicks, scrolls, file downloads, site
//     search) is switched on inside the GA4 property itself.
// 
// While the placeholder is still in place nothing is loaded and nothing is
// sent — the site stays exactly as fast as it is now.
// 
const GA_MEASUREMENT_ID = "G-XXXXXXXXXX";

(function () {
    if (!GA_MEASUREMENT_ID.startsWith("G-") || GA_MEASUREMENT_ID === "G-XXXXXXXXXX") return;

    const tag = document.createElement("script");
    tag.async = true;
    tag.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA_MEASUREMENT_ID);
    document.head.appendChild(tag);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };

    window.gtag("js", new Date());
    window.gtag("config", GA_MEASUREMENT_ID);
})();
