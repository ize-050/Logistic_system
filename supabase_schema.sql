-- 1. ลบของเก่าออกทั้งหมดเพื่อเริ่มใหม่แบบสะอาดๆ
drop table if exists transactions;
drop type if exists app_type;
drop type if exists trans_type;

-- 2. สร้างประเภทแอป (Apps)
create type app_type as enum ('Grab', 'Bolt', 'Lalamove', 'Other');

-- 3. สร้างประเภทรายการ (Income/Expense)
create type trans_type as enum ('Income', 'Expense');

-- 4. สร้างตารางเก็บข้อมูล รายรับ-รายจ่าย (รองรับ Ice & Mind)
create table transactions (
  id uuid default gen_random_uuid() primary key,
  date date not null default current_date,
  rider_name text not null default 'Ice', -- ฟิลด์เก็บชื่อคนขับ (Ice หรือ Mind)
  type trans_type not null,
  app app_type not null default 'Other',
  category text not null,
  amount decimal(10, 2) not null,
  trips integer default 0,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. เปิดระบบความปลอดภัย (RLS)
alter table transactions enable row level security;

-- 6. อนุญาตให้ทุกคนเข้าถึงได้ (Public Access)
create policy "Public Access" on transactions
  for all using (true);

-- 7. (Optional) สร้าง Index เพื่อให้ค้นหาข้อมูลตามชื่อคนขับและวันที่ได้เร็วขึ้น
create index idx_transactions_rider_date on transactions(rider_name, date);
