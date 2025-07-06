import { mutation } from "./_generated/server";

// Add more cybersecurity challenges
export const addMoreChallenges = mutation({
  args: {},
  handler: async (ctx) => {
    const existingChallenges = await ctx.db.query("challenges").collect();
    if (existingChallenges.length > 4) return; // Only add if we have just the initial 4

    const additionalChallenges = [
      // Advanced Web Security
      {
        title: "CSRF Token Bypass",
        description: "تجاوز حماية CSRF في نموذج تحويل الأموال",
        category: "web",
        difficulty: "intermediate",
        points: 250,
        content: `
          <div class="challenge-content">
            <h3>تحدي CSRF</h3>
            <p>يوجد نموذج تحويل أموال محمي بـ CSRF token:</p>
            <code><input type="hidden" name="csrf_token" value="abc123"></code>
            <p>كيف يمكن تجاوز هذه الحماية؟</p>
            <p>ما هو الهجوم المناسب؟</p>
          </div>
        `,
        solution: "social engineering",
        hints: [
          "فكر في طرق الحصول على الـ token",
          "ما هي الطريقة التي تتطلب تفاعل المستخدم؟",
          "الهندسة الاجتماعية هي الحل"
        ],
        isActive: true,
        createdAt: Date.now(),
      },
      {
        title: "Directory Traversal",
        description: "الوصول لملفات النظام عبر ثغرة Path Traversal",
        category: "web",
        difficulty: "intermediate",
        points: 220,
        content: `
          <div class="challenge-content">
            <h3>تحدي Directory Traversal</h3>
            <p>يوجد رابط لتحميل الملفات:</p>
            <code>download.php?file=document.pdf</code>
            <p>كيف يمكن الوصول لملف /etc/passwd؟</p>
          </div>
        `,
        solution: "../../../etc/passwd",
        hints: [
          "استخدم .. للانتقال للمجلد الأعلى",
          "كرر العملية عدة مرات",
          "جرب: ../../../etc/passwd"
        ],
        isActive: true,
        createdAt: Date.now(),
      },
      {
        title: "Command Injection",
        description: "تنفيذ أوامر النظام عبر ثغرة في تطبيق الويب",
        category: "web",
        difficulty: "advanced",
        points: 300,
        content: `
          <div class="challenge-content">
            <h3>تحدي Command Injection</h3>
            <p>يوجد نموذج ping يستقبل عنوان IP:</p>
            <code>ping -c 4 $ip</code>
            <p>كيف يمكن تنفيذ أمر إضافي؟</p>
          </div>
        `,
        solution: "127.0.0.1; cat /etc/passwd",
        hints: [
          "استخدم ; لفصل الأوامر",
          "جرب تنفيذ أمر cat",
          "الحل: 127.0.0.1; cat /etc/passwd"
        ],
        isActive: true,
        createdAt: Date.now(),
      },
      {
        title: "JWT Token Manipulation",
        description: "تلاعب في JWT token لتصعيد الصلاحيات",
        category: "web",
        difficulty: "advanced",
        points: 320,
        content: `
          <div class="challenge-content">
            <h3>تحدي JWT</h3>
            <p>JWT Token:</p>
            <code>eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJ1c2VyIjoiZ3Vlc3QiLCJyb2xlIjoiYWRtaW4ifQ.</code>
            <p>ما هو دور المستخدم في هذا التوكن؟</p>
          </div>
        `,
        solution: "admin",
        hints: [
          "فك ترميز الجزء الثاني من JWT",
          "استخدم Base64 decoder",
          "ابحث عن حقل role"
        ],
        isActive: true,
        createdAt: Date.now(),
      },

      // Advanced Cryptography
      {
        title: "Caesar Cipher",
        description: "فك تشفير رسالة مشفرة بخوارزمية قيصر",
        category: "cryptography",
        difficulty: "beginner",
        points: 150,
        content: `
          <div class="challenge-content">
            <h3>تحدي شيفرة قيصر</h3>
            <p>الرسالة المشفرة:</p>
            <code>KHOOR ZRUOG</code>
            <p>تم استخدام إزاحة 3. ما هي الرسالة الأصلية؟</p>
          </div>
        `,
        solution: "HELLO WORLD",
        hints: [
          "كل حرف مزاح بـ 3 مواضع",
          "K -> H, H -> E, وهكذا",
          "الجواب: HELLO WORLD"
        ],
        isActive: true,
        createdAt: Date.now(),
      },
      {
        title: "Base64 Decoding",
        description: "فك تشفير نص مُرمز بـ Base64",
        category: "cryptography",
        difficulty: "beginner",
        points: 80,
        content: `
          <div class="challenge-content">
            <h3>تحدي Base64</h3>
            <p>النص المُرمز:</p>
            <code>U2VjdXJpdHkgaXMgaW1wb3J0YW50</code>
            <p>ما هو النص الأصلي؟</p>
          </div>
        `,
        solution: "Security is important",
        hints: [
          "استخدم أداة فك ترميز Base64",
          "Base64 ليس تشفير، بل ترميز",
          "الجواب: Security is important"
        ],
        isActive: true,
        createdAt: Date.now(),
      },
      {
        title: "Vigenère Cipher",
        description: "فك تشفير Vigenère cipher",
        category: "cryptography",
        difficulty: "intermediate",
        points: 280,
        content: `
          <div class="challenge-content">
            <h3>تحدي Vigenère</h3>
            <p>النص المشفر: LXFOPVEFRNHR</p>
            <p>المفتاح: LEMON</p>
            <p>ما هو النص الأصلي؟</p>
          </div>
        `,
        solution: "ATTACKATDAWN",
        hints: [
          "استخدم جدول Vigenère",
          "كرر المفتاح حسب طول النص",
          "الجواب: ATTACKATDAWN"
        ],
        isActive: true,
        createdAt: Date.now(),
      },
      {
        title: "Hash Collision",
        description: "العثور على تصادم في دالة hash بسيطة",
        category: "cryptography",
        difficulty: "expert",
        points: 450,
        content: `
          <div class="challenge-content">
            <h3>تحدي Hash Collision</h3>
            <p>دالة hash بسيطة: hash(x) = x mod 100</p>
            <p>إذا كان hash("password") = 23</p>
            <p>اعطِ مثال آخر له نفس الـ hash</p>
          </div>
        `,
        solution: "123",
        hints: [
          "ابحث عن رقم آخر باقي قسمته على 100 هو 23",
          "123 mod 100 = 23",
          "أي رقم ينتهي بـ 23 سيعمل"
        ],
        isActive: true,
        createdAt: Date.now(),
      },

      // Network Security
      {
        title: "Wireshark Analysis",
        description: "تحليل حركة الشبكة للعثور على كلمة مرور",
        category: "network",
        difficulty: "advanced",
        points: 350,
        content: `
          <div class="challenge-content">
            <h3>تحدي تحليل الشبكة</h3>
            <p>تم التقاط حركة HTTP التالية:</p>
            <pre>
POST /login HTTP/1.1
Host: example.com
Content-Type: application/x-www-form-urlencoded

username=admin&password=c2VjcmV0MTIz
            </pre>
            <p>ما هي كلمة المرور؟</p>
          </div>
        `,
        solution: "secret123",
        hints: [
          "كلمة المرور مُرمزة بـ Base64",
          "فك ترميز c2VjcmV0MTIz",
          "الجواب: secret123"
        ],
        isActive: true,
        createdAt: Date.now(),
      },
      {
        title: "DNS Spoofing Detection",
        description: "اكتشاف هجوم DNS Spoofing",
        category: "network",
        difficulty: "intermediate",
        points: 260,
        content: `
          <div class="challenge-content">
            <h3>تحدي DNS Spoofing</h3>
            <p>استجابات DNS لنفس الاستعلام:</p>
            <pre>
google.com -> 172.217.16.142
google.com -> 192.168.1.50
google.com -> 172.217.16.142
            </pre>
            <p>أي IP مشبوه؟</p>
          </div>
        `,
        solution: "192.168.1.50",
        hints: [
          "ابحث عن IP غير طبيعي",
          "192.168.x.x هو IP محلي",
          "Google لا يستخدم IPs محلية"
        ],
        isActive: true,
        createdAt: Date.now(),
      },
      {
        title: "Firewall Rule Analysis",
        description: "تحليل قواعد الجدار الناري",
        category: "network",
        difficulty: "intermediate",
        points: 200,
        content: `
          <div class="challenge-content">
            <h3>تحدي قواعد Firewall</h3>
            <p>قواعد الجدار الناري:</p>
            <pre>
ALLOW tcp 80 from any
ALLOW tcp 443 from any
ALLOW tcp 22 from 192.168.1.0/24
DENY all
            </pre>
            <p>هل يمكن الوصول لـ SSH من 10.0.0.1؟</p>
          </div>
        `,
        solution: "no",
        hints: [
          "SSH يعمل على المنفذ 22",
          "10.0.0.1 ليس في شبكة 192.168.1.0/24",
          "القاعدة الأخيرة تمنع كل شيء"
        ],
        isActive: true,
        createdAt: Date.now(),
      },

      // Digital Forensics
      {
        title: "File Signature Analysis",
        description: "تحديد نوع الملف من البيانات الست عشرية",
        category: "forensics",
        difficulty: "beginner",
        points: 120,
        content: `
          <div class="challenge-content">
            <h3>تحدي تحليل توقيع الملف</h3>
            <p>البيانات الست عشرية لبداية الملف:</p>
            <code>89 50 4E 47 0D 0A 1A 0A</code>
            <p>ما هو نوع الملف؟</p>
          </div>
        `,
        solution: "PNG",
        hints: [
          "هذا توقيع ملف صورة",
          "ابحث عن PNG file signature",
          "الجواب: PNG"
        ],
        isActive: true,
        createdAt: Date.now(),
      },
      {
        title: "Deleted File Recovery",
        description: "استرداد ملف محذوف من القرص الصلب",
        category: "forensics",
        difficulty: "intermediate",
        points: 290,
        content: `
          <div class="challenge-content">
            <h3>تحدي استرداد الملفات</h3>
            <p>تم العثور على البيانات التالية في القطاعات المحذوفة:</p>
            <code>secret_document.txt: "The password is cyber2024"</code>
            <p>ما هي كلمة المرور؟</p>
          </div>
        `,
        solution: "cyber2024",
        hints: [
          "الملف المحذوف يحتوي على كلمة مرور",
          "اقرأ محتوى الملف بعناية",
          "كلمة المرور: cyber2024"
        ],
        isActive: true,
        createdAt: Date.now(),
      },
      {
        title: "Timeline Analysis",
        description: "تحليل الجدول الزمني للأحداث",
        category: "forensics",
        difficulty: "advanced",
        points: 340,
        content: `
          <div class="challenge-content">
            <h3>تحدي التحليل الزمني</h3>
            <p>سجل الأحداث:</p>
            <pre>
10:00 - User login
10:15 - File access: secret.txt
10:20 - USB device connected
10:22 - File copied to USB
10:25 - User logout
            </pre>
            <p>كم دقيقة استغرق نسخ الملف؟</p>
          </div>
        `,
        solution: "2",
        hints: [
          "احسب الفرق بين وقت الوصول للملف ونسخه",
          "من 10:20 إلى 10:22",
          "الجواب: 2 دقيقة"
        ],
        isActive: true,
        createdAt: Date.now(),
      },

      // Reverse Engineering
      {
        title: "Simple Assembly",
        description: "فهم كود Assembly بسيط",
        category: "reverse-engineering",
        difficulty: "beginner",
        points: 160,
        content: `
          <div class="challenge-content">
            <h3>تحدي Assembly</h3>
            <p>كود Assembly:</p>
            <pre>
mov eax, 5
mov ebx, 3
add eax, ebx
            </pre>
            <p>ما هي قيمة eax في النهاية؟</p>
          </div>
        `,
        solution: "8",
        hints: [
          "mov ينقل القيمة",
          "add يجمع القيمتين",
          "5 + 3 = 8"
        ],
        isActive: true,
        createdAt: Date.now(),
      },
      {
        title: "String Obfuscation",
        description: "فك تشويش النصوص في البرنامج",
        category: "reverse-engineering",
        difficulty: "intermediate",
        points: 250,
        content: `
          <div class="challenge-content">
            <h3>تحدي فك التشويش</h3>
            <p>نص مشوش في البرنامج:</p>
            <code>char str[] = {0x48, 0x61, 0x63, 0x6B, 0x65, 0x72, 0x00};</code>
            <p>ما هو النص الأصلي؟</p>
          </div>
        `,
        solution: "Hacker",
        hints: [
          "حول الست عشري إلى ASCII",
          "0x48 = H, 0x61 = a",
          "النص: Hacker"
        ],
        isActive: true,
        createdAt: Date.now(),
      },
      {
        title: "License Key Algorithm",
        description: "عكس هندسة خوارزمية مفتاح الترخيص",
        category: "reverse-engineering",
        difficulty: "expert",
        points: 480,
        content: `
          <div class="challenge-content">
            <h3>تحدي مفتاح الترخيص</h3>
            <p>خوارزمية التحقق:</p>
            <pre>
bool check_license(string key) {
    if (key.length() != 8) return false;
    int sum = 0;
    for (int i = 0; i < 8; i++) {
        sum += key[i];
    }
    return sum == 640;
}
            </pre>
            <p>اعطِ مفتاح ترخيص صحيح</p>
          </div>
        `,
        solution: "AAAAAAAA",
        hints: [
          "الطول يجب أن يكون 8",
          "مجموع قيم ASCII = 640",
          "A = 65, 65 × 8 = 520... جرب حروف أخرى"
        ],
        isActive: true,
        createdAt: Date.now(),
      }
    ];

    for (const challenge of additionalChallenges) {
      await ctx.db.insert("challenges", challenge);
    }
  },
});
