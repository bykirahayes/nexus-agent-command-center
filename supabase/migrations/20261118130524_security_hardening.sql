revoke execute on function public.seed_demo_workspace() from public, anon, authenticated;

do $$
declare t text;
begin
  foreach t in array array['providers','agents','tasks','task_messages','workflows','browser_sessions','permissions','approvals','audit_events'] loop
    execute format('drop policy if exists "owner all" on public.%I', t);
    execute format(
      'create policy "owner all" on public.%I for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id)',
      t
    );
  end loop;
end $$;

create index if not exists approvals_task_id_idx on public.approvals(task_id);
create index if not exists permissions_session_id_idx on public.permissions(session_id);
create index if not exists task_messages_agent_id_idx on public.task_messages(agent_id);
create index if not exists task_messages_task_id_idx on public.task_messages(task_id);
