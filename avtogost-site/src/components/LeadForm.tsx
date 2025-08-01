"use client";

import { useState } from "react";

interface LeadFormProps {
  defaultComment: string;
  onSuccess: () => void;
}

export default function LeadForm({ defaultComment, onSuccess }: LeadFormProps) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    comment: defaultComment,
    consent: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const submit = async () => {
    if (!form.name || !form.phone || !form.consent) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        throw new Error((await res.json()).message || "Ошибка отправки");
      }
      setSent(true);
      onSuccess();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Ошибка";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return <p className="text-green-600">Спасибо! Мы свяжемся с вами в ближайшее время.</p>;
  }

  return (
    <div className="space-y-4 mt-4 bg-white dark:bg-neutral-800 p-4 rounded shadow">
      <h3 className="text-lg font-semibold">Оставить заявку</h3>
      <div className="grid gap-3">
        <input
          className="input"
          placeholder="Имя *"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          className="input"
          placeholder="Телефон *"
          name="phone"
          type="tel"
          value={form.phone}
          pattern="^\\+?[0-9\-\s]{7,15}$"
          onChange={handleChange}
          required
        />
        <input
          className="input"
          placeholder="Email (необязательно)"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
        />
        <textarea
          className="input h-24"
          name="comment"
          value={form.comment}
          onChange={handleChange}
        />
        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            name="consent"
            checked={form.consent}
            onChange={handleChange}
            required
          />
          <span>
            Я даю согласие на обработку персональных данных и подтверждаю, что ознакомлен(а) с
            <a href="/privacy" className="underline ml-1" target="_blank" rel="noopener noreferrer">
              политикой конфиденциальности
            </a>
            .
          </span>
        </label>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          className="btn-primary w-full"
          onClick={submit}
          disabled={loading || !form.consent}
        >
          {loading ? "Отправляем..." : "Отправить"}
        </button>
      </div>
    </div>
  );
}