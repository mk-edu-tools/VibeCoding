-- ============================================================================
--  鷺江國小 教務處整合服務平台 — Supabase 後端結構
--  檔案 1/2：schema.sql （在 Supabase → SQL Editor 執行）
--  內容：資料表、列級安全(RLS)政策、輔助函式、新使用者自動建檔
--  ※ 請在「乾淨的新專案」上執行；本檔可重複執行（含 drop policy if exists）。
-- ============================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- 1. 列舉型別 ENUM
-- ---------------------------------------------------------------------------
do $$ begin
  create type unit_type as enum ('主任','教學組','資訊組','課程組','註冊組','雙語組');
exception when duplicate_object then null; end $$;

do $$ begin
  create type user_role as enum ('staff','teacher','public');
exception when duplicate_object then null; end $$;

do $$ begin
  create type request_status as enum ('待審核','處理中','已核准','已退回');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- 2. 身分對照表 role_assignments
--    先在此登錄教職員 email → 角色／組別；之後在 Auth 建立同 email 的帳號，
--    系統會自動把角色與組別套到該使用者的 profiles（見 handle_new_user）。
-- ---------------------------------------------------------------------------
create table if not exists public.role_assignments (
  email text primary key,
  name  text not null,
  title text default '',
  role  user_role not null default 'public',
  unit  text default '教師'
);

-- ---------------------------------------------------------------------------
-- 3. 使用者檔案 profiles（一對一對應 auth.users）
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  name       text not null default '',
  title      text default '',
  role       user_role not null default 'public',
  unit       text default '教師',           -- staff 為辦公室組別；其餘為「教師」「學生／家長」
  created_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- 4. 內容資料表：公告 / 行事曆 / 教學資源 / 線上申請
-- ---------------------------------------------------------------------------
create table if not exists public.announcements (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  body         text not null,
  unit         unit_type not null,           -- 發布組別
  category     text default '一般',
  pinned       boolean default false,
  publish_date date default current_date,
  author       text default '',
  created_by   uuid references public.profiles(id) on delete set null,
  created_at   timestamptz default now()
);

create table if not exists public.events (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  event_date  date not null,
  unit        unit_type not null,            -- 主辦組別
  type        text default '活動',
  location    text default '',
  description text default '',
  created_by  uuid references public.profiles(id) on delete set null,
  created_at  timestamptz default now()
);

create table if not exists public.resources (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  unit         unit_type not null,           -- 提供組別
  category     text default '表單下載',
  description  text default '',
  link         text default '#',
  updated_date date default current_date,
  created_by   uuid references public.profiles(id) on delete set null,
  created_at   timestamptz default now()
);

create table if not exists public.requests (
  id             uuid primary key default gen_random_uuid(),
  type           text not null,              -- swap/train/grant/enroll/venue/intl
  title          text not null,
  applicant_id   uuid references public.profiles(id) on delete set null,
  applicant_name text not null,
  applicant_role user_role not null default 'public',
  group_unit     unit_type not null,         -- 承辦（路由）組別
  status         request_status not null default '待審核',
  fields         jsonb not null default '{}'::jsonb,
  reviewer       text default '',
  reviewed_at    date,
  note           text default '',
  created_date   date default current_date,
  created_at     timestamptz default now()
);

create index if not exists idx_ann_date  on public.announcements(publish_date desc);
create index if not exists idx_evt_date  on public.events(event_date);
create index if not exists idx_req_group on public.requests(group_unit, status);
create index if not exists idx_req_appl  on public.requests(applicant_id);

-- ---------------------------------------------------------------------------
-- 5. 輔助函式（SECURITY DEFINER：可安全讀取 profiles，避免 RLS 遞迴）
-- ---------------------------------------------------------------------------
create or replace function public.my_role() returns user_role
  language sql stable security definer set search_path = public as
$$ select role from public.profiles where id = auth.uid() $$;

create or replace function public.my_unit() returns text
  language sql stable security definer set search_path = public as
$$ select unit from public.profiles where id = auth.uid() $$;

create or replace function public.is_staff() returns boolean
  language sql stable security definer set search_path = public as
$$ select coalesce((select role = 'staff' from public.profiles where id = auth.uid()), false) $$;

create or replace function public.is_director() returns boolean
  language sql stable security definer set search_path = public as
$$ select coalesce((select unit = '主任' from public.profiles where id = auth.uid()), false) $$;

grant execute on function public.my_role(), public.my_unit(),
                          public.is_staff(), public.is_director()
  to authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. 新使用者自動建立 profile（依 role_assignments 套用角色／組別）
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare a public.role_assignments%rowtype;
begin
  select * into a from public.role_assignments where lower(email) = lower(new.email);
  insert into public.profiles (id, name, title, role, unit)
  values (
    new.id,
    coalesce(a.name,  new.raw_user_meta_data->>'name',  split_part(new.email,'@',1)),
    coalesce(a.title, new.raw_user_meta_data->>'title', ''),
    coalesce(a.role,  'public'),
    coalesce(a.unit,  new.raw_user_meta_data->>'unit',  '教師')
  )
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- 7. 啟用 RLS
-- ---------------------------------------------------------------------------
alter table public.profiles       enable row level security;
alter table public.announcements  enable row level security;
alter table public.events         enable row level security;
alter table public.resources      enable row level security;
alter table public.requests       enable row level security;
alter table public.role_assignments enable row level security;  -- 預設無政策＝僅後台可讀寫

-- ===== profiles ============================================================
drop policy if exists profiles_read   on public.profiles;
drop policy if exists profiles_update on public.profiles;
drop policy if exists profiles_insert on public.profiles;

create policy profiles_read on public.profiles
  for select to authenticated
  using (auth.uid() = id or public.is_staff());

create policy profiles_insert on public.profiles
  for insert to authenticated
  with check (auth.uid() = id);

-- 一般人僅能改自己；主任可調整任何人的角色／組別
create policy profiles_update on public.profiles
  for update to authenticated
  using (auth.uid() = id or public.is_director())
  with check (auth.uid() = id or public.is_director());

-- ===== announcements / events / resources（三表政策相同） ==================
-- 讀：所有登入者可看（全校）；寫：主任或同組承辦
drop policy if exists ann_read on public.announcements;
drop policy if exists ann_ins  on public.announcements;
drop policy if exists ann_upd  on public.announcements;
drop policy if exists ann_del  on public.announcements;
create policy ann_read on public.announcements for select to authenticated using (true);
create policy ann_ins  on public.announcements for insert to authenticated
  with check (public.is_staff() and (public.is_director() or unit::text = public.my_unit()));
create policy ann_upd  on public.announcements for update to authenticated
  using       (public.is_director() or (public.is_staff() and unit::text = public.my_unit()))
  with check  (public.is_director() or (public.is_staff() and unit::text = public.my_unit()));
create policy ann_del  on public.announcements for delete to authenticated
  using       (public.is_director() or (public.is_staff() and unit::text = public.my_unit()));

drop policy if exists evt_read on public.events;
drop policy if exists evt_ins  on public.events;
drop policy if exists evt_upd  on public.events;
drop policy if exists evt_del  on public.events;
create policy evt_read on public.events for select to authenticated using (true);
create policy evt_ins  on public.events for insert to authenticated
  with check (public.is_staff() and (public.is_director() or unit::text = public.my_unit()));
create policy evt_upd  on public.events for update to authenticated
  using       (public.is_director() or (public.is_staff() and unit::text = public.my_unit()))
  with check  (public.is_director() or (public.is_staff() and unit::text = public.my_unit()));
create policy evt_del  on public.events for delete to authenticated
  using       (public.is_director() or (public.is_staff() and unit::text = public.my_unit()));

drop policy if exists res_read on public.resources;
drop policy if exists res_ins  on public.resources;
drop policy if exists res_upd  on public.resources;
drop policy if exists res_del  on public.resources;
create policy res_read on public.resources for select to authenticated using (true);
create policy res_ins  on public.resources for insert to authenticated
  with check (public.is_staff() and (public.is_director() or unit::text = public.my_unit()));
create policy res_upd  on public.resources for update to authenticated
  using       (public.is_director() or (public.is_staff() and unit::text = public.my_unit()))
  with check  (public.is_director() or (public.is_staff() and unit::text = public.my_unit()));
create policy res_del  on public.resources for delete to authenticated
  using       (public.is_director() or (public.is_staff() and unit::text = public.my_unit()));

-- ===== requests ============================================================
-- 讀：申請人看自己的；承辦組別／主任看路由給該組的
-- 新增：登入者可建立屬於自己的申請
-- 更新（審核）：主任或承辦組別；刪除：僅主任
drop policy if exists req_read on public.requests;
drop policy if exists req_ins  on public.requests;
drop policy if exists req_upd  on public.requests;
drop policy if exists req_del  on public.requests;
create policy req_read on public.requests for select to authenticated
  using (applicant_id = auth.uid()
         or public.is_director()
         or (public.is_staff() and group_unit::text = public.my_unit()));
create policy req_ins on public.requests for insert to authenticated
  with check (applicant_id = auth.uid());
create policy req_upd on public.requests for update to authenticated
  using       (public.is_director() or (public.is_staff() and group_unit::text = public.my_unit()))
  with check  (public.is_director() or (public.is_staff() and group_unit::text = public.my_unit()));
create policy req_del on public.requests for delete to authenticated
  using (public.is_director());

-- ---------------------------------------------------------------------------
-- 8. 即時更新（Realtime）：師生端公告/行事曆/申請可即時刷新（選用）
-- ---------------------------------------------------------------------------
do $$ begin alter publication supabase_realtime add table public.announcements; exception when others then null; end $$;
do $$ begin alter publication supabase_realtime add table public.events;        exception when others then null; end $$;
do $$ begin alter publication supabase_realtime add table public.resources;     exception when others then null; end $$;
do $$ begin alter publication supabase_realtime add table public.requests;      exception when others then null; end $$;

-- 完成。接著執行 seed.sql 載入示範資料與教職員身分對照。
