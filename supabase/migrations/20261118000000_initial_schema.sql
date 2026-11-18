create type public.task_status as enum ('draft','queued','running','needs_approval','completed','failed');

create table public.providers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  provider_key text not null,
  status text not null default 'not_configured',
  connection_method text not null default 'api_key',
  secret_ref text,
  scopes text[] not null default '{}',
  connected_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, provider_key)
);
create table public.agents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  name text not null,
  provider_key text not null,
  model text not null,
  role text not null default 'generalist',
  description text,
  is_demo boolean not null default false,
  enabled boolean not null default true,
  created_at timestamptz not null default now()
);
create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  title text not null,
  instructions text not null default '',
  target_url text,
  agent_ids uuid[] not null default '{}',
  mode text not null default 'parallel',
  risk text not null default 'low',
  status public.task_status not null default 'draft',
  synthesis text,
  is_demo boolean not null default false,
  cost_usd numeric not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.task_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  agent_id uuid references public.agents(id) on delete set null,
  kind text not null default 'message',
  content text not null,
  citations text[] not null default '{}',
  created_at timestamptz not null default now()
);
create table public.workflows (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  name text not null,
  description text,
  nodes jsonb not null default '[]',
  status text not null default 'draft',
  is_template boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.browser_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  label text not null,
  companion_id text,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  revoked_at timestamptz
);
create table public.permissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  domain text not null,
  level text not null default 'read_only',
  session_id uuid references public.browser_sessions(id) on delete cascade,
  created_at timestamptz not null default now()
);
create table public.approvals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  task_id uuid references public.tasks(id) on delete cascade,
  action_type text not null,
  summary text not null,
  status text not null default 'pending',
  decided_at timestamptz,
  created_at timestamptz not null default now()
);
create table public.audit_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  category text not null,
  action text not null,
  detail text,
  created_at timestamptz not null default now()
);

do $$
declare t text;
begin
  foreach t in array array['providers','agents','tasks','task_messages','workflows','browser_sessions','permissions','approvals','audit_events'] loop
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
    execute format('grant all on public.%I to service_role', t);
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy "owner all" on public.%I for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id)', t);
  end loop;
end $$;

create or replace function public.seed_demo_workspace()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  a1 uuid := gen_random_uuid(); a2 uuid := gen_random_uuid(); a3 uuid := gen_random_uuid(); a4 uuid := gen_random_uuid();
  t1 uuid := gen_random_uuid(); t2 uuid := gen_random_uuid(); t3 uuid := gen_random_uuid(); t4 uuid := gen_random_uuid();
  u uuid := new.id;
begin
  insert into agents (id,user_id,name,provider_key,model,role,description,is_demo) values
   (a1,u,'Atlas','openai','gpt-5','lead','Lead strategist and coordinator',true),
   (a2,u,'Sage','anthropic','claude-sonnet','reviewer','Careful critic, flags risks and weak evidence',true),
   (a3,u,'Lumen','gemini','gemini-2.5-pro','researcher','Fast broad research with citations',true),
   (a4,u,'Scout','perplexity','sonar-pro','researcher','Web search specialist',true);
  insert into tasks (id,user_id,title,instructions,target_url,agent_ids,mode,risk,status,synthesis,is_demo,cost_usd,created_at) values
   (t1,u,'Audit pricing page for clarity','Review pricing tiers and identify confusing copy.','https://example.com/pricing',array[a1,a2,a3],'lead_reviewers','low','completed','Consensus: tier names are ambiguous; 2 of 3 agents recommend an annual toggle. Sage disagreed on removing the free tier.',true,0.42, now()-interval '2 days'),
   (t2,u,'Compare onboarding flows of 3 competitors','Parallel research and summary table.',null,array[a3,a4],'parallel','low','running',null,true,0.18, now()-interval '3 hours'),
   (t3,u,'Draft homepage hero rewrite','Draft then review; publishing requires approval.','https://example.com',array[a1,a2],'sequential','high','needs_approval',null,true,0.09, now()-interval '1 hour'),
   (t4,u,'Debate: build vs buy analytics','Two agents argue, coordinator decides.',null,array[a1,a2],'debate','medium','queued',null,true,0, now()-interval '10 minutes');
  insert into task_messages (user_id,task_id,agent_id,kind,content,citations,created_at) values
   (u,t1,a3,'output','Found 3 tiers; "Pro" and "Plus" overlap in 80% of features.',array['https://example.com/pricing'], now()-interval '47 hours'),
   (u,t1,a2,'critique','The overlap claim needs a feature-by-feature table. Also, removing Free could hurt acquisition.',array[]::text[], now()-interval '46 hours'),
   (u,t1,a1,'synthesis','Recommend renaming tiers and adding annual toggle; keep Free tier pending data.',array[]::text[], now()-interval '45 hours'),
   (u,t2,a3,'output','Competitor A uses a 4-step checklist onboarding.',array['https://competitor-a.example'], now()-interval '2 hours'),
   (u,t3,a1,'handoff','Draft complete, handing to Sage for review.',array[]::text[], now()-interval '50 minutes'),
   (u,t3,a2,'critique','Draft approved with minor edits. Publishing is blocked until you approve.',array[]::text[], now()-interval '40 minutes');
  insert into approvals (user_id,task_id,action_type,summary) values
   (u,t3,'publish','Publish revised hero copy to example.com');
  insert into workflows (user_id,name,description,is_template,nodes) values
   (u,'Research a website','Crawl read-only, summarise, cite sources',true,'[{"id":"n1","type":"trigger","label":"Manual trigger"},{"id":"n2","type":"agent","label":"Researcher reads site"},{"id":"n3","type":"output","label":"Cited summary"}]'),
   (u,'Compare AI answers','Same prompt to multiple agents, compare',true,'[{"id":"n1","type":"trigger","label":"Prompt input"},{"id":"n2","type":"agent","label":"Agents answer in parallel"},{"id":"n3","type":"agent","label":"Coordinator compares"},{"id":"n4","type":"output","label":"Comparison table"}]'),
   (u,'Audit a landing page','UX, copy and SEO audit',true,'[{"id":"n1","type":"trigger","label":"URL input"},{"id":"n2","type":"agent","label":"Copy audit"},{"id":"n3","type":"agent","label":"UX critique"},{"id":"n4","type":"review","label":"Reviewer gate"},{"id":"n5","type":"output","label":"Audit report"}]'),
   (u,'Draft and review website changes','Draft, review, approve, then apply',true,'[{"id":"n1","type":"trigger","label":"Change request"},{"id":"n2","type":"agent","label":"Draft changes"},{"id":"n3","type":"agent","label":"Peer review"},{"id":"n4","type":"review","label":"Human approval"},{"id":"n5","type":"output","label":"Apply via browser companion"}]');
  insert into audit_events (user_id,category,action,detail) values
   (u,'system','workspace_created','Demo workspace seeded with simulated agents and tasks'),
   (u,'task','status_change','Demo: "Draft homepage hero rewrite" awaiting approval');
  return new;
end $$;

create trigger on_auth_user_created_seed after insert on auth.users
for each row execute function public.seed_demo_workspace();