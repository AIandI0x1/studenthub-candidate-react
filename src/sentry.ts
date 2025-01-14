import * as Sentry from "@sentry/capacitor";
import * as SentryReact from "@sentry/react";

Sentry.init(
  {
    dsn: "https://1c996b75b785482aae7c345ce717b5dd@o70039.ingest.us.sentry.io/5339282",
    // Set your release version, such as "getsentry@1.0.0"
    release: "studenthub-candidate-react@latest",
    // Set your dist version, such as "1"
    dist: "1.0.0",
    integrations: [
      // Registers and configures the Tracing integration,
      // which automatically instruments your application to monitor its
      // performance, including custom Angular routing instrumentation
      Sentry.browserTracingIntegration(),
      // Registers the Replay integration,
      // which automatically captures Session Replays
      Sentry.replayIntegration(),
    ],
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for tracing.
    // We recommend adjusting this value in production
    // Learn more at
    // https://docs.sentry.io/platforms/javascript/configuration/options/#traces-sample-rate
    tracesSampleRate: 1.0,
    // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: [
      //"localhost", 
      /^https:\/\/student\.dev\.studenthub\.co/,
      /^https:\/\/student\.studenthub\.co/
    ],
    // Capture Replay for 10% of all sessions,
    // plus for 100% of sessions with an error
    // Learn more at
    // https://docs.sentry.io/platforms/javascript/session-replay/configuration/#general-integration-configuration
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  },
  // Forward the init method from @sentry/angular
  SentryReact.init
);
