# Devnex Tech Studio — Digital Agency Website

A responsive, multi-page creative studio website built with plain HTML, CSS, and JavaScript. No build step or framework is required.

## Run locally

Open `index.html` in a browser, or serve this folder with the VS Code Live Server extension. A local server is recommended for browser testing.

## Customize the studio

- Set the studio name, business email, WhatsApp number, optional social URLs, and (when available) contact endpoint in `assets/js/config.js`.
- Update the shared design tokens (colors, typography, spacing, and content width) at the top of `assets/css/style.css`.
- Edit service descriptions and deliverables in `services.html`.
- Add project image files under `assets/images/` and set each `data-src` on a `data-project-image` in `portfolio.html` or `index.html` to its relative path. The CSS-built mockup remains visible until an image loads. Current examples are labeled concepts and are not client work.
- Update the studio story and positioning in `about.html` with details that are true to your business.

## Contact form setup

The contact form validates required fields in the browser and prepares an email using the visitor's email application. A `mailto:` link does not send the message; the visitor must review and send it from that app. Configure a real business address as `businessEmail` in `assets/js/config.js` to enable the email handoff.

Configure `whatsappNumber` with the complete international number in E.164 format, including its country calling code and a leading `+` (for example, `+<country code><number>`). It is intentionally blank until the full number is verified; local numbers without the explicit `+` are never treated as internationally addressed. Only real HTTPS social URLs are rendered; placeholder social links are not configured.

For online submissions, set `contactEndpoint` to a secure HTTPS backend endpoint. The browser sends the inquiry as JSON and shows explicit success or failure feedback. Configure server-side validation, spam protection, and privacy disclosures; do not put private API keys or credentials in frontend files.

## Before launch

Complete the draft in `privacy.html`, confirm all contact details, add real social URLs and portfolio images, and verify the site on the production domain. The privacy notice calls out details requiring business and jurisdiction-specific input.

 