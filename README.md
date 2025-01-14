# StudentHub

A Next.js-based platform for student job management and recruitment.

## Implemented Features

### Authentication & Profile
- Multi-step registration flow with comprehensive profile building
- Login with email/password
- Profile management including:
  - Personal information
  - Education history
  - Work experience
  - Skills assessment
  - Document uploads (Civil ID, Driver's License)
  - Profile photo and video introduction

### Dashboard
- Activity tracking
- Assignment management
- Banking information
- Chat system
- Company interactions
- Interview scheduling
- Payment processing
- Wallet management
- Work history and logging

### Additional Features
- Internationalization support (i18next)
- Error tracking (Sentry)
- Analytics integration (Mixpanel)
- Form validation (Zod)
- UI Components (shadcn/ui)

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Documentation

Detailed documentation can be found in the `/docs` directory:

- [Features Documentation](./docs/features/README.md)
- [Architecture Overview](./docs/architecture/README.md)
- [API Documentation](./docs/api/README.md)

## Tech Stack
 
- React.js 
- TypeScript
- Redux Toolkit
- TailwindCSS
- shadcn/ui
- Zod
- i18next
- Sentry
- Mixpanel

# validation 

https://www.npmjs.com/package/zod#basic-usage

# todo 
- make sure email verification code are 4 alphanumeric character 
- PWA 

- prefetch next pages : https://stackoverflow.com/questions/72507091/how-to-prefetch-code-for-multiple-pages-from-one-page-request-in-next-js 
  `router.prefetch(url, as)`
- ping for candidate video status and update 


- test chat
- test OneSignal
- google signin deprecated, need to migrate, can try next.js popular auth.js with other option like linkedin, facebook 
 

# design 

https://www.figma.com/design/UmcngZ41ORf4DWnYRzqxFm/StudentHub-Components?node-id=219-7957&node-type=frame&m=dev

# generate static site 

Generate a Static Build
Ensure your Next.js app uses Static Site Generation (SSG) or fully static content.
Update the next.config.js file:

`module.exports = {
    output: 'export',
};`

This tells Next.js to export the app as static HTML.
Run the build and export commands:

`npm run build
npx next export`

This generates a out folder containing your static files.

# todo 
- api call to check video upload status if uploaded but not processed
- errors not getting caught on sentry + slack 

- Test oneSignal
- remove/ delete profile not asking for confirmation
- tabs flashing on route change 

# improvements 
- search icon in education page inputs

# to test in mobile app 
- OneSignal 
- Photo upload 
- Video upload 
- CV upload 
- App notification for chat message if not in app?
- location tracking with background service 