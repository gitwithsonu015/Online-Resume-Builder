# Online Resume Builder TODO

## Steps from Approved Plan (Tech: HTML/JS/Tailwind/jsPDF/Stripe)

### 1. [x] Create core files structure
   - index.html (main UI)
   - styles.css (custom styles)
   - script.js (logic) - Basic logic, templates switch, preview, save/load, PDF, simulated Stripe
   - templates.js (resume data)
   - payment.html (Stripe redirect)
   - config.js (keys/pricing)

### 2. [x] Implement UI & Responsiveness
   - Templates switcher
   - Form builder & live preview
   - Colorful theme (violet/amber)

### 3. [x] Add Save/Load (localStorage)

### 4. [x] PDF Export (jsPDF + html2canvas)

### 5. [x] UPI Payment Integration (QR + manual confirm)
   - Prompt on download
   - QR for 8294255694@ybl ₹49
   - Confirm → download

### 6. [ ] Test & Polish
   - Responsive checks
   - Get Stripe key from user
   - Demo command: open index.html

Progress: Core app functional with simulated payments. Update Stripe key in config.js. For real payments, need backend (e.g., Node/Express for session creation).
