export const projects = {
  associa: {
    name:'Associa', number:'01', kind:'WEB / MOBILE / OPERATIONS', color:'#a74730',
    description:'Association operations, from the back office to the field.',
    layers:[
      {name:'Web + field', code:'INTERFACE', stack:'Next.js · React Native', description:'A web back office and an Android app serve different parts of the same operational workflow.', shape:'screens'},
      {name:'Shared contracts', code:'CONTRACTS', stack:'TypeScript · Shared DTOs', description:'Shared API contracts keep the applications aligned around the same data structures.', shape:'contracts'},
      {name:'Background work', code:'WORKER', stack:'Node.js · pnpm · Turborepo', description:'A separate worker handles background responsibilities alongside the web and mobile applications.', shape:'processor'},
      {name:'Persistent data', code:'DATA', stack:'PostgreSQL · Drizzle', description:'The data layer supports operational records. Database acceptance tests and offline protocols are part of the engineering work.', shape:'data'}
    ]
  },
  peptai: {
    name:'PeptAI', number:'02', kind:'MOBILE / TRACKING / INVENTORY', color:'#4e715f',
    description:'A mobile application for tracking, inventory, and personal records. Collaborative product work.',
    layers:[
      {name:'Mobile interface', code:'INTERFACE', stack:'React Native · Expo Router', description:'Onboarding, tracking, and inventory flows live in an Expo mobile application.', shape:'mobile'},
      {name:'Session + state', code:'STATE', stack:'Zustand · TanStack Query', description:'Local state and data queries connect the interface to session-aware application behavior.', shape:'contracts'},
      {name:'Service layer', code:'SERVICES', stack:'TypeScript · Supabase', description:'A Supabase service layer connects authentication and app operations to persistent records.', shape:'processor'},
      {name:'Personal records', code:'DATA', stack:'Supabase', description:'Tracking and inventory records persist beyond the screen. The service layer keeps these records available beyond local interface state.', shape:'data'}
    ]
  },
  swarms: {
    name:'Swarms', number:'03', kind:'WORKSPACE / AGENTS / EXECUTION', color:'#365f7c',
    description:'An agent workspace with scheduled runs and background execution.',
    layers:[
      {name:'Workspace', code:'INTERFACE', stack:'Next.js · TypeScript · Clerk', description:'A chat interface connects users to agent configuration and run progress, with ownership checks around access.', shape:'terminal'},
      {name:'Run orchestration', code:'ORCHESTRATION', stack:'Trigger.dev · Node.js', description:'Background tasks and schedules keep work running beyond the initial web request.', shape:'contracts'},
      {name:'Agent runtime', code:'EXECUTION', stack:'OpenAI Codex · Node.js', description:'A separate execution runtime carries out agent work. Cancellation handling is part of the run lifecycle.', shape:'processor'},
      {name:'Run history', code:'DATA', stack:'PostgreSQL / Neon · Drizzle', description:'Status, events, and checkpoints are persisted so a run can be followed over time.', shape:'data'}
    ]
  },
  zyllux: {
    name:'Zyllux', number:'04', kind:'WEB / ESTIMATION / WORKFLOWS', color:'#8a642a',
    description:'A multilingual studio platform with a configurable project estimator.',
    layers:[
      {name:'Studio pages', code:'INTERFACE', stack:'Next.js · next-intl · GSAP', description:'English and French pages combine a studio presentation with carefully timed motion.', shape:'screens'},
      {name:'Typed estimator', code:'LOGIC', stack:'TypeScript · Shared calculations', description:'Browser and server share typed calculation logic, keeping the estimator consistent across both environments.', shape:'contracts'},
      {name:'Form workflows', code:'WORKFLOWS', stack:'Cloudflare Workers', description:'Worker-based form workflows handle submissions outside the page interface.', shape:'processor'},
      {name:'Versioned data', code:'DATA', stack:'Versioned configuration · D1', description:'Configuration versions and saved snapshots support reproducible estimates. Production quote persistence depends on the configured storage and hosting.', shape:'data'}
    ]
  }
};
