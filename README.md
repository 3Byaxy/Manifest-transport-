# Manifest Transport System

### Manifest Fellowship — Infront of Girls Hostel Stage (MKA/KIU01R)

---

## What this project is

A lightweight web application built for **Manifest Fellowship** to digitize and manage their transport registration process at the Kawanda pickup stage. It replaces two physical paper forms with a mobile-friendly digital system accessible by coordinators on the ground and administrators from any device.

---

## The problem it solves

Every Sunday, a coordinator at the Girls Hostel stage manually collects passenger names, phone numbers, and details on paper. This creates four problems:

- Data gets lost, damaged, or is hard to read
- No way to know if someone is registering for the first time or returning
- Financial accountability (cost per head, balance, contributions) is tracked separately with no connection to the passenger list
- Tuesday meetup attendance is tracked on a completely separate sheet with no link to transport data

This system solves all four.

---

## Features

### Coordinator view (mobile-first)

- Register passengers quickly in a queue — optimised for phone use
- Fields: Full Name, Phone Number, Place of Residence, First Time (Yes/No), Category (Residential / Institution / School)
- Real-time duplicate detection — blocks re-registration by phone number
- Links each registration to a specific event and trip

### Admin view (password protected)

- See all registered passengers per event
- Identify returning members (highlighted automatically)
- Track trip financials: cost of vehicle, cost per head, booking fee, cash collected, balance
- Tuesday meetup attendance tracker — marks new vs returning members
- Export any event's data to Excel or PDF

---

## Tech stack

| Layer    | Technology            | Why                                 |
| -------- | --------------------- | ----------------------------------- |
| Frontend | HTML, CSS, JavaScript | Simple, fast, no build tools needed |
| Backend  | Google Apps Script    | Free, serverless, no hosting cost   |
| Database | Google Sheets         | Free, real-time, exportable         |
| Hosting  | Netlify               | Free static hosting, instant deploy |

> **Upgrade path:** When data grows beyond ~5,000 rows, the Google Sheets backend swaps directly to a MySQL database. The frontend does not change — only the Apps Script URL is replaced with a Node.js/Express API endpoint.

---

## Project structure

```
manifest-transport/
│
├── index.html        ← Coordinator registration form (mobile-first)
├── admin.html        ← Admin dashboard (password protected)
├── style.css         ← All styling
├── form.js           ← Form logic, validation, submission, duplicate check
├── admin.js          ← Dashboard logic, data display, export
└── README.md         ← This file
```

---

## Setup instructions

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/manifest-transport.git
cd manifest-transport
```

### 2. Set up the Google Sheet database

- Go to sheets.google.com
- Create a new spreadsheet named `Manifest Transport DB`
- Add these headers in Row 1:

```
ID | Timestamp | Name | Phone | Residence | First Time | Category | Event | Trip ID
```

### 3. Deploy the Google Apps Script backend

- In your Google Sheet go to Extensions → Apps Script
- Paste the contents of `apps-script/Code.gs`
- Click Deploy → New Deployment → Web App
- Set access to "Anyone"
- Copy the deployment URL

### 4. Connect the frontend to the backend

- Open `form.js`
- Replace `YOUR_APPS_SCRIPT_URL` with the URL from step 3

### 5. Deploy to Netlify

- Go to netlify.com
- Drag and drop your project folder
- Your app is live instantly at a public URL

---

## Data flow

```
Coordinator's phone
      ↓
Registration Form (index.html + form.js)
      ↓
Google Apps Script (duplicate check → save)
      ↓
Google Sheet (database)
      ↑
Admin Dashboard (admin.html + admin.js)
      ↑
Admin's device (any browser, password protected)
```

---

## Stage details

| Field        | Value                   |
| ------------ | ----------------------- |
| Stage Name   | Infront of Girls Hostel |
| Stage ID     | MKA/KIU01R              |
| Stage Code   | BBR/MTG03R              |
| Division     | Makindye A              |
| Location     | Kawanda                 |
| Organisation | Manifest Fellowship     |

---

## Developer

Built by [Your Name]
Contact: [your email]
GitHub: [your github profile]

---

## Version

`v1.0.0` — Initial release
Built: March 2026
Status: Active
