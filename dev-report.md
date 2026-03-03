# Dev Report — logistics-tracker
**วันที่ตรวจ:** 3 มีนาคม 2026
**Stack:** Next.js 16 · React 19 · TypeScript 5 · Supabase · Tailwind CSS 4

---

## โปรเจคนี้ทำอะไร?

**Rider Pro** — แอป Finance Tracker สำหรับ rider delivery ส่วนตัว 2 คน (Ice และ Mind)

| Feature | รายละเอียด |
|---------|-----------|
| ติดตามรายรับ | บันทึกรายได้จาก Grab, Bolt, Lalamove |
| ติดตามรายจ่าย | บันทึกค่าใช้จ่าย เช่น น้ำมัน, ค่าอาหาร, ซ่อมบำรุง |
| ดู Net Profit | คำนวณกำไรสุทธิแบบ real-time |
| กรองข้อมูล | ดูรายเดือน / รายปี / แยกตาม rider |
| App Breakdown | แสดงรายได้แยกตาม Grab / Bolt / Lalamove |
| Rider Breakdown | เปรียบเทียบ Ice vs Mind เมื่อดู "TOTAL" |
| Backend จริง | เชื่อม Supabase (PostgreSQL) ไม่ใช่ mock data |

---

## ผลการตรวจสอบ Code

| ประเภท | จำนวน | ระดับ |
|--------|--------|-------|
| TypeScript Error | 0 | ✅ ผ่าน |
| ESLint Error | 0 | ✅ ผ่าน |
| Logic Bug | 3 | 🔴 มีปัญหา |
| UX/Feature ที่ขาด | 4 | 🟡 ควรปรับ |

---

## 🔴 Logic Bugs (ส่งผลต่อความถูกต้องของข้อมูล)

---

### Bug 1 — TransactionModal: State ไม่ reset เมื่อปิดแล้วเปิดใหม่
**ไฟล์:** `src/components/entry/TransactionModal.tsx`

เมื่อกด "Save" แล้วเปิด Modal ใหม่อีกครั้ง:
- `amount` และ `trips` → reset แล้ว ✅
- `type`, `app`, `category`, `date` → **ยังคงค่าเดิมจากครั้งที่แล้ว** ❌

ตัวอย่าง: บันทึก Expense > Fuel ไปแล้ว พอเปิด Modal ใหม่ยังเห็น Expense > Fuel อยู่

**แก้ไข:** เพิ่ม `key` prop บน `<TransactionModal>` ใน `page.tsx`
```tsx
// ใน page.tsx
<TransactionModal
  key={isModalOpen ? 'open' : 'closed'}  // ← เพิ่มบรรทัดนี้
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  onSubmit={handleAddTransaction}
/>
```

---

### Bug 2 — History list แสดงแค่ 15 รายการ (hard-coded)
**ไฟล์:** `src/app/page.tsx` บรรทัด 206

```tsx
{transactions.slice(0, 15).map(t => (
```

ถ้ามีรายการในเดือนนั้น > 15 รายการ จะมองไม่เห็นของที่เกินมา และไม่มีปุ่ม "Load More" หรือ Pagination ใดๆ เลย

**แก้ไข:** เพิ่ม state `showAll` หรือเพิ่ม pagination:
```tsx
const [showAll, setShowAll] = useState(false);
// ...
{(showAll ? transactions : transactions.slice(0, 15)).map(t => ( ... ))}
{transactions.length > 15 && !showAll && (
  <button onClick={() => setShowAll(true)}>
    Show all {transactions.length} entries
  </button>
)}
```

---

### Bug 3 — `notes` field ใน type แต่ไม่มีใน UI
**ไฟล์:** `src/types/index.ts` บรรทัด 14

```ts
export interface Transaction {
  // ...
  notes?: string;  // ← มีใน type
}
```

แต่ใน `TransactionModal.tsx` ไม่มี input field สำหรับ `notes` เลย ทำให้ไม่สามารถบันทึก notes ลง Supabase ได้ และ notes ที่อาจมีใน DB จะไม่ถูกแสดงใน UI

---

## 🟡 UX Issues (ควรปรับเพื่อประสบการณ์ที่ดีขึ้น)

---

### UX 1 — Error handling ใช้ `alert()` แบบ browser native
**ไฟล์:** `src/app/page.tsx` บรรทัด 69, 80

```tsx
alert('Error saving data!');
alert('ลบไม่สำเร็จ กรุณาลองใหม่');
```

`alert()` ดูไม่ smooth กับ UI สีเข้มของแอป ควรเปลี่ยนเป็น toast notification หรือ error state บน UI

---

### UX 2 — Total Trips ไม่ถูกแสดงบน Dashboard
**ไฟล์:** `src/app/page.tsx`

ใน `service.ts` มีการนับ `totalTrips` ไว้ในระบบ:
```ts
acc.totalTrips += curr.trips;
```

แต่ใน UI ไม่มีการแสดง `summary.totalTrips` ที่ไหนเลย ทั้งที่เป็นข้อมูลสำคัญสำหรับ rider

---

### UX 3 — ปุ่ม "Add Entry" ไม่ show เมื่ออยู่ Tab "TOTAL"
ถูก design ไว้ว่า:
```tsx
{activeRider !== 'All' && (
  <div className="fixed bottom-8 ...">
    <button>Add Entry</button>
  </div>
)}
```

ซึ่งสมเหตุสมผลเพราะ "TOTAL" เป็น view รวม แต่ UX อาจทำให้ user งงว่าทำไมปุ่ม Add หายไป ควรเพิ่ม visual hint เล็กๆ ว่า "สลับไปที่ ICE หรือ MIND เพื่อเพิ่มรายการ"

---

### UX 4 — Supabase client ไม่มี error ถ้า ENV ไม่ครบ
**ไฟล์:** `src/lib/supabase/client.ts`

```ts
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
```

ถ้า `.env.local` ไม่มีค่า `NEXT_PUBLIC_SUPABASE_ANON_KEY` แอปจะ connect ไม่ได้ แต่จะไม่มี error message ชัดเจน ควรเพิ่ม validation:
```ts
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase ENV missing — check .env.local');
}
```

---

## ✅ สิ่งที่ดีในโปรเจคนี้

- TypeScript ผ่าน 100% ไม่มี error เลย
- ESLint ผ่านสะอาด
- ใช้ Supabase จริง ไม่ใช่ mock data — พร้อมใช้งาน production
- Service layer แยกชัดเจนใน `lib/supabase/service.ts`
- Date filter logic ถูกต้อง ทั้ง Monthly และ Yearly mode
- UI design สวยงาม — dark theme, responsive
- `useCallback` + `useEffect` pattern ใช้ถูกต้อง ไม่มี infinite loop
- Types ครบถ้วน แยกไว้ใน `src/types/index.ts`

---

## 📋 ลำดับการแก้ที่แนะนำ

1. **Bug 1** — เพิ่ม `key` บน `<TransactionModal>` (1 บรรทัด, ง่ายมาก)
2. **Bug 3** — เพิ่ม `notes` input ใน TransactionModal (~10 บรรทัด)
3. **Bug 2** — เพิ่ม "Show all" button บน history list (~5 บรรทัด)
4. **UX 2** — แสดง Total Trips บน Dashboard (~3 บรรทัด)
5. **UX 4** — เพิ่ม ENV validation ใน `client.ts` (~3 บรรทัด)
6. **UX 1** — เปลี่ยน alert เป็น toast (ต้องเพิ่ม component ใหม่)
