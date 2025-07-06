import React, { useState } from "react";

export function SubscriptionPlans() {
  // حالة لتخزين اسم الباقة المختارة عند تأكيد الاشتراك
  const [confirmedPlan, setConfirmedPlan] = useState<string | null>(null);

  // حالة تخزين بيانات النموذج (اختياري، لو تبي تتوسع)
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    plan: "",
  });

  // دالة التعامل مع تغيير الحقول
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  // دالة عند إرسال النموذج
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // تحقق بسيط إن الحقول الأساسية مليانة
    if (!formData.fullname || !formData.email || !formData.phone || !formData.plan) {
      alert("يرجى تعبئة جميع الحقول المطلوبة.");
      return;
    }

    // هنا ممكن تضيف منطق إرسال البيانات للسيرفر أو API

    // نحدث الحالة لإظهار رسالة التأكيد مع الباقة المختارة
    setConfirmedPlan(formData.plan);
  }

  // إذا تم تأكيد الاشتراك نعرض رسالة التأكيد
  if (confirmedPlan) {
    return (
      <div className="p-8 text-center text-white">
        <h1 className="text-3xl font-bold text-green-400 mb-4">✅ تم استلام طلب الاشتراك!</h1>
        <p className="text-lg mb-4">الباقة المختارة: <span className="text-yellow-300 font-bold">{confirmedPlan}</span></p>
        <p className="text-gray-300">سيتم التواصل معك خلال وقت قصير لتفعيل حسابك.</p>
        <p className="mt-6 text-sm text-gray-500">لأي استفسار: واتساب 0500000000</p>
      </div>
    );
  }

  // إذا لم يتم التأكيد نعرض نموذج الاشتراك
  return (
    <div className="max-w-md mx-auto p-8 bg-gray-900 rounded-lg shadow-lg text-right text-white">
      <h2 className="text-2xl font-bold mb-6">طلب الاشتراك - CybrainSA</h2>
      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="fullname"
          placeholder="الاسم الكامل"
          value={formData.fullname}
          onChange={handleChange}
          required
          className="w-full p-3 mb-4 rounded bg-gray-800 border border-gray-700 text-white"
        />

        <input
          type="email"
          name="email"
          placeholder="البريد الإلكتروني"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-3 mb-4 rounded bg-gray-800 border border-gray-700 text-white"
        />

        <input
          type="tel"
          name="phone"
          placeholder="رقم الجوال"
          value={formData.phone}
          onChange={handleChange}
          required
          pattern="^50[0-9]{7}$"
          title="يجب أن يبدأ رقم الجوال بـ 50 ويتكون من 9 أرقام كاملة"
          className="w-full p-3 mb-4 rounded bg-gray-800 border border-gray-700 text-white"
        />

        <select
          name="plan"
          value={formData.plan}
          onChange={handleChange}
          required
          className="w-full p-3 mb-6 rounded bg-gray-800 border border-gray-700 text-white"
        >
          <option value="">اختر نوع الاشتراك</option>
          <option value="الباقة الأساسية">الباقة الأساسية</option>
          <option value="الباقة المتقدمة">الباقة المتقدمة</option>
          <option value="الباقة الذهبية">الباقة الذهبية</option>
        </select>

        <button
          type="submit"
          className="w-full py-3 bg-green-600 hover:bg-green-700 rounded font-bold transition"
        >
          تأكيد الاشتراك
        </button>
      </form>
    </div>
  );
}
