# Complete Sentry Setup Walkthrough Guide

This guide walks through the entire process of setting up Sentry monitoring with GitHub Actions, including every navigation step, screen, and decision point encountered.

## 🎯 Overview

This walkthrough covers:
- Creating a Sentry account and project
- Navigating Sentry's interface step-by-step
- Configuring Node.js SDK
- Setting up authentication tokens
- Integrating with GitHub Actions
- Common navigation challenges and solutions

## 📋 Step 1: Initial Sentry Account Setup

### 1.1 Account Creation
1. Navigate to **https://sentry.io/**
2. Click **"Sign Up"** 
3. Enter email and create password
4. Verify email address from confirmation email
5. Complete profile setup

### 1.2 Organization Setup
- Organization name gets auto-generated (e.g., `your-company-name-ll`)
- This becomes your **org slug** in URLs like: `https://your-org-slug.sentry.io/`

## 📋 Step 2: Project Creation Wizard

### 2.1 Platform Selection Screen
```
Create a new project in 3 steps
Set up a separate project for each part of your application

Choose your platform
Popular | Server | Mobile | Desktop | Serverless | Gaming | All

Filter Platforms
[Search box]

[Platform icons displayed:]
Next.js    React    React Native    Node.js
Laravel    FastAPI    Flutter    Django
Python    Express    Browser JavaScript    PHP
Rails    iOS    Nest.js    Flask
Vue    ASP.NET Core    Nuxt    .NET MAUI
Angular    Android    Spring Boot    Symfony
```

**Selection:** Click **"Node.js"** for server-side monitoring

### 2.2 Alert Configuration Screen
```
Set your alert frequency

○ Alert me on high priority issues
○ When there are more than [10] occurrences of [a unique error] in [one minute]
○ I'll create my own alerts later

☑ Notify via email
☐ Connect to messaging
```

**Recommendation:** Choose **"Alert me on high priority issues"** for immediate notifications

### 2.3 Project Naming Screen
```
Name your project and assign it a team
Project slug: [node-xyz]  (auto-generated)
Team: [#your-team-name]

[Create Project]
```

**Note:** The project slug (e.g., `node-xyz`) becomes part of your project URL

## 📋 Step 3: Framework Selection

### 3.1 Framework Detection Popup
```
Do you use a framework?
○ Express
○ Fastify  
○ Koa
○ Vanilla (No framework)
○ Other
```

**Selection:** Choose **"Vanilla"** for basic Node.js applications

## 📋 Step 4: SDK Configuration Screens

### 4.1 Installation Screen
```
Configure Node.js SDK

In this quick guide you'll use npm or yarn to set up:
☑ Error Monitoring
☐ Logs  
☐ Metrics
☐ Tracing
☐ Profiling

Install
Add the Sentry Node SDK as a dependency:
[npm] [yarn] [pnpm]

npm install @sentry/node --save
```

### 4.2 SDK Configuration Screen
```
Configure SDK

[Copy DSN] button

Initialize Sentry as early as possible in your application's lifecycle.
To initialize the SDK before everything else, create an external file called instrument.js/mjs.

JavaScript
instrument.(js|mjs)

const Sentry = require("@sentry/node");

Sentry.init({
  dsn: "https://abc123@o1234567890.ingest.de.sentry.io/1234567890",
  sendDefaultPii: true,
});
```

**Key Information to Copy:**
- **DSN URL:** This is your project's unique identifier
- Format: `https://[key]@[host]/[project-id]`

### 4.3 Integration Example Screen
```
Make sure to import instrument.js/mjs at the top of your file.

JavaScript
instrument.(js|mjs)

require("./instrument.js");

const { createServer } = require("node:http");
const server = createServer((req, res) => {
  // server code
});
server.listen(3000, "127.0.0.1");
```

### 4.4 Verification Screen
```
Verify
This snippet contains an intentional error and can be used as a test:

const Sentry = require("@sentry/node");

try {
  foo();
} catch (e) {
  Sentry.captureException(e);
}

[Take me to Issues] [Skip Onboarding]
```

**Action:** Click **"Take me to Issues"** to proceed to dashboard

## 📋 Step 5: Project Dashboard Navigation

### 5.1 Main Dashboard View
```
Feed    [project-name]    All Envs    14D

Last Seen    Save As

Get Started with Sentry Issues
Your code sleuth eagerly awaits its first mission.

Set up the Sentry SDK for [project-name]
1. Install
2. Configure SDK  
3. Verify
   Preview a Sentry Issue

[Back] [Next]
```

**URL Pattern:** `https://your-org.sentry.io/organizations/your-org/issues/?project=1234567890`

**Key Information to Extract:**
- **Org Slug:** From URL path `/organizations/YOUR_ORG_SLUG/`
- **Project Slug:** From project name in dashboard
- **Project ID:** From URL parameter `?project=1234567890`

## 📋 Step 6: Authentication Token Creation

### 6.1 Navigating to Token Settings
**Path:** Profile Icon (top right) → Settings → Account → API → Personal Tokens

**Alternative URLs:**
- `https://your-org.sentry.io/settings/account/`
- `https://your-org.sentry.io/settings/account/api/auth-tokens/`

### 6.2 Token Creation Screen
```
Settings > Account > API > Personal Tokens

Personal Tokens
[Create New Token]

Personal tokens allow you to perform actions against the Sentry API on behalf of your account.
For more information on how to use the web API, see our documentation.

Token | Created On | Scopes
You haven't created any authentication tokens yet.
```

### 6.3 Token Configuration Screen
```
Create New Personal Token

General
Name: [GitHub Actions]

Permissions
Project
  Projects, Tags, Debug Files, and Feedback
  ○ No Access  ○ Read  ○ Write  ○ Admin

Team  
  Teams of members
  ○ No Access  ○ Read  ○ Write  ○ Admin

Release
  Releases, Commits, and related Files  
  ○ No Access  ○ Read  ○ Write  ○ Admin

Issue & Event
  Issues, Events, and workflow statuses
  ○ No Access  ○ Read  ○ Write  ○ Admin

Organization
  Manage Organizations, resolve IDs, retrieve Repositories and Commits
  ○ No Access  ○ Read  ○ Write  ○ Admin

Member
  Manage Members within Teams
  ○ No Access  ○ Read  ○ Write  ○ Admin

Alerts
  Manage Alerts
  ○ No Access  ○ Read  ○ Write  ○ Admin

Permissions Preview
Your token will have the following scopes:
project:read
release:admin  
organization:read
[additional scopes based on selections]

[Cancel] [Create Token]
```

**Recommended Permissions for GitHub Actions:**
- **Project:** Read (minimum required)
- **Release:** Admin (for creating releases)
- **Organization:** Read (for org access)
- **Issue & Event:** Read (optional, for reading events)

### 6.4 Token Generated Screen
```
Please copy this token to a safe place — it won't be shown again!

sntryu_abcd1234567890abcdef1234567890abcdef1234567890abcdef1234567890

[I've saved it]
```

**Important:** Copy this token immediately - it's only shown once!

## 📋 Step 7: Common Navigation Challenges

### 7.1 Finding Auth Tokens
**Problem:** Looking in organization settings instead of personal settings
**Solution:** 
- ❌ Wrong: Organization Settings → Auth Providers
- ✅ Correct: Profile → Account Settings → API → Personal Tokens

### 7.2 Understanding URL Structure
```
Sentry URL Breakdown:
https://[org-slug].sentry.io/organizations/[org-slug]/projects/[project-slug]/

Example:
https://my-company-ll.sentry.io/organizations/my-company-ll/projects/node-abc/

Extract:
- Org Slug: my-company-ll
- Project Slug: node-abc
```

### 7.3 Permission Scope Selection
**Common Mistake:** Selecting minimal permissions
**Best Practice:** For CI/CD integration, select:
- `project:read` - Read project data
- `release:admin` - Create and manage releases  
- `org:read` - Access organization info

## 📋 Step 8: GitHub Integration Setup

### 8.1 Required GitHub Secrets
Navigate to: `https://github.com/USERNAME/REPO/settings/secrets/actions`

**Add these 4 secrets:**

1. **SENTRY_DSN**
   ```
   https://key123@o1234567890.ingest.de.sentry.io/1234567890
   ```

2. **SENTRY_ORG** 
   ```
   your-org-slug
   ```

3. **SENTRY_PROJECT**
   ```
   your-project-slug  
   ```

4. **SENTRY_AUTH_TOKEN**
   ```
   sntryu_your_generated_token_here
   ```

### 8.2 GitHub Actions Workflow Integration
```yaml
env:
  SENTRY_AUTH_TOKEN: ${{ secrets.SENTRY_AUTH_TOKEN }}
  SENTRY_ORG: ${{ secrets.SENTRY_ORG }}
  SENTRY_PROJECT: ${{ secrets.SENTRY_PROJECT }}
  SENTRY_DSN: ${{ secrets.SENTRY_DSN }}
```

## 📋 Step 9: Verification Process

### 9.1 Testing the Integration
1. **Trigger Workflow:** Push code or manually trigger GitHub Actions
2. **Monitor Logs:** Check GitHub Actions logs for Sentry CLI output
3. **Check Sentry:** Look for new releases and error events
4. **Verify Alerts:** Confirm email notifications are working

### 9.2 Expected Sentry Dashboard Changes
After successful integration:
- **Releases Tab:** New releases appear automatically
- **Issues Tab:** Error events from your application
- **Performance:** Transaction data (if enabled)

## 🔧 Troubleshooting Common Issues

### Issue 1: "Project not found" errors
**Cause:** Incorrect org slug or project slug
**Solution:** Double-check URL structure and secret values

### Issue 2: "Authentication failed" errors  
**Cause:** Invalid or expired auth token
**Solution:** Regenerate token with correct permissions

### Issue 3: No events appearing in Sentry
**Cause:** Incorrect DSN or network issues
**Solution:** Verify DSN format and test connectivity

### Issue 4: Permission denied for releases
**Cause:** Insufficient token permissions
**Solution:** Ensure token has `release:admin` or `release:write` scope

## 📚 Key Takeaways

1. **Organization vs Personal Settings:** Auth tokens are in personal settings, not org settings
2. **URL Structure:** Understanding Sentry URLs helps extract org/project slugs
3. **Token Permissions:** Be generous with permissions for CI/CD use cases
4. **DSN Security:** DSN can be public, but auth tokens must be kept secret
5. **Testing:** Always test the integration with a simple error before production

## 🔗 Quick Reference Links

- **Sentry Documentation:** https://docs.sentry.io/
- **Node.js SDK Guide:** https://docs.sentry.io/platforms/node/
- **API Documentation:** https://docs.sentry.io/api/
- **GitHub Actions Integration:** https://docs.sentry.io/product/integrations/source-code-mgmt/github/

---

This guide captures the complete navigation experience and should help anyone set up Sentry monitoring with confidence, avoiding common pitfalls and navigation confusion.