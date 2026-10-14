‏## ‏پلاگین opencode-rtl-fa

‏پاسخ‌های اوپن‌کد را فارسی و راست‌چین می‌کند.
‏مدل را به فارسی فکر کردن و فارسی نوشتن وادار می‌کند.
‏و برای متن پاسخ، راست‌چینی به اطاعت مدل واگذار نشده است.

‏## ‏این پلاگین چه می‌کند

‏دو لایهٔ مستقل دارد.
‏لایهٔ اول، پیش از هر درخواست، یک یادآور کوتاه و امری به انتهای دستورهای سیستمی می‌چسباند تا مدل فارسی و راست‌چین بنویسد و استدلالش را هم فارسی انجام دهد.
‏لایهٔ دوم، پس از تولید پاسخ، متن نهایی را می‌گیرد و به هر سطر بیرون از بلوک کد نشانهٔ راست‌چین `U+200F` می‌دهد.
‏لایهٔ دوم به مدل وابسته نیست؛ خودش متن را اصلاح می‌کند.

‏## ‏نصب

‏دو راه دارد.

‏راه اول، از npm. نام بسته را در فهرست پلاگین‌های کانفیگ بگذار:

```json
{
  "plugin": ["opencode-rtl-fa"]
}
```

‏اوپن‌کد خودش بسته را با bun نصب می‌کند و در این مسیر کش می‌کند:

```
~/.cache/opencode/node_modules/
```

‏راه دوم، نصب محلی. فایل `index.ts` را در پوشهٔ پلاگین‌های کانفیگ خودت بگذار:

```
~/.config/opencode/plugins/
```

‏یا در پوشهٔ پروژه:

```
.opencode/plugins/
```

‏در هر دو حالت، پس از تغییر باید اوپن‌کد را کامل ببندی و باز کنی. کانفیگ و پلاگین‌ها فقط هنگام راه‌اندازی خوانده می‌شوند.

‏## ‏تنظیمات

‏گزینه‌ها اختیاری‌اند:

```json
{
  "plugin": [
    [
      "opencode-rtl-fa",
      {
        "reminder": true,
        "enforce": true,
        "log": "/tmp/opencode-rtl-fa.log"
      }
    ]
  ]
}
```

‏توضیح گزینه‌ها:

‏`reminder` یادآور را به دستورهای سیستمی تزریق می‌کند. پیش‌فرض `true`.
‏`enforce` متن نهایی را قهری راست‌چین می‌کند. پیش‌فرض `true`.
‏`log` اگر مسیری بدهی، برای هر اقدام یک سطر در آن فایل نوشته می‌شود. برای عیب‌یابی خوب است.
‏`reminderText` متن دلخواه تو را جای یادآور پیش‌فرض می‌گذارد.

‏## ‏آنچه پلاگین انجام نمی‌دهد

‏رابط خود اوپن‌کد را ترجمه نمی‌کند. منوها، دکمه‌ها و پیام‌های داخلی برنامه بیرون از دسترس پلاگین‌ها هستند.
‏پس اگر دنبال فارسی شدن منوها هستی، این بسته آن کار را نمی‌کند.

‏## ‏محدودیت صریح

‏لایهٔ دوم به یک هوک آزمایشی اوپن‌کد تکیه دارد. اگر نسخهٔ تو آن هوک را صدا نزند، فقط لایهٔ اول کار می‌کند و تضمین قهری برقرار نمی‌شود.
‏برای بررسی، گزینهٔ `log` را بده و پر شدن فایل را ببین.

‏متن فکر کردن (reasoning) با هیچ هوکی بازنویسی نمی‌شود.
‏در کد اوپن‌کد، هوک `experimental.text.complete` فقط در شاخهٔ `case "text-end"` صدا زده می‌شود و بخش متن با `type: "text"` ساخته می‌شود؛ یعنی این هوک به بخش reasoning دست نمی‌زند.
‏پس فارسی بودن فکر کردن فقط از راه یادآور دستوری قابل تعقیب است، نه با اصلاح خودکار متن.
‏اگر مدل سرسختی کند، فکر کردنش می‌تواند انگلیسی بماند، درحالی‌که متن پاسخ همچنان قهری راست‌چین می‌شود.

‏## ‏آزمون

```bash
bun test
```

‏## ‏مجوز

‏GNU General Public License, version 2 or any later version.
‏متن کامل در فایل `LICENSE` است.
‏Copyright (C) 2026 Morteza Honar

---

## ‏English

‏A plugin for opencode that makes answers Persian and right to left.

‏It has two layers. One appends a short imperative reminder to the end of the system prompt, asking the model to think and write in Persian. The other rewrites the finished text of every reply and puts `U+200F` (RLM) in front of every line outside a fenced code block, so the text is laid out right to left. The second layer does not depend on the model obeying anything.

‏Install it by adding the package name to the `plugin` array in your config:

```json
{
  "plugin": ["opencode-rtl-fa"]
}
```

‏It does not translate the opencode interface itself; menus and built-in messages are out of reach for plugins.

‏The reasoning stream cannot be rewritten by any hook: in the opencode source, `experimental.text.complete` is triggered only from the `case "text-end"` branch, whose part is created with `type: "text"`. Persian reasoning therefore relies on the prompt layer alone, not on enforcement.

‏Licensed under the GNU General Public License, version 2 or any later version.
