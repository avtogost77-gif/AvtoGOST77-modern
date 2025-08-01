"use client";

import { useState } from "react";
import type { PricingResult, CargoType } from "@/lib/types";
import LeadForm from "./LeadForm";

export default function Calculator() {
  const [form, setForm] = useState({
    fromCity: "Москва",
    toCity: "Санкт-Петербург",
    weight: "1000",
    volume: "",
    cargoType: "general" as CargoType,
  });
  const [result, setResult] = useState<PricingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [leadOpen, setLeadOpen] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const calculate = async () => {
    if (!form.fromCity || !form.toCity || !form.weight) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromCity: form.fromCity,
          toCity: form.toCity,
          weight: Number(form.weight),
          volume: form.volume ? Number(form.volume) : 0,
          cargoType: form.cargoType,
        }),
      });
      const data = (await res.json()) as PricingResult;
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full max-w-xl bg-white dark:bg-neutral-900 shadow rounded p-6 space-y-4">
      <h2 className="text-2xl font-semibold mb-2">Калькулятор стоимости</h2>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        <input
          name="fromCity"
          value={form.fromCity}
          onChange={handleChange}
          placeholder="Откуда"
          className="input"
        />
        <input
          name="toCity"
          value={form.toCity}
          onChange={handleChange}
          placeholder="Куда"
          className="input"
        />
        <input
          name="weight"
          value={form.weight}
          onChange={handleChange}
          placeholder="Вес, кг"
          type="number"
          className="input"
        />
        <input
          name="volume"
          value={form.volume}
          onChange={handleChange}
          placeholder="Объем, м³ (необязательно)"
          type="number"
          step="0.1"
          className="input"
        />
        <select name="cargoType" value={form.cargoType} onChange={handleChange} className="input">
          <option value="general">Обычный</option>
          <option value="fragile">Хрупкий</option>
          <option value="valuable">Ценный</option>
          <option value="dangerous">Опасный</option>
          <option value="perishable">Скоропортящийся</option>
          <option value="oversized">Негабарит</option>
          <option value="consolidated">Сборный</option>
        </select>
      </div>
      <button
        onClick={calculate}
        disabled={loading}
        className="btn-primary w-full sm:w-auto"
      >
        {loading ? "Рассчитываем..." : "Рассчитать"}
      </button>

      {result && (
        <div className="mt-4">
          {"error" in result && result.error ? (
            <div className="text-red-600">
              <p>{result.message}</p>
              {result.alternativePrice && (
                <p>Отдельная машина: {result.alternativePrice.toLocaleString()} ₽</p>
              )}
            </div>
          ) : (
            "price" in result && (
              <div className="space-y-2">
                <p className="text-xl font-medium">Стоимость: {result.price.toLocaleString()} ₽</p>
                <p>Расстояние: {result.distance} км</p>
                <p>Транспорт: {result.transport}</p>
                <p>Срок: {result.deliveryTime}</p>
                {!leadOpen && (
                  <button
                    className="btn-primary mt-4"
                    onClick={() => setLeadOpen(true)}
                  >
                    Оставить заявку
                  </button>
                )}
              </div>
            )
          )}
        </div>
      )}

      {leadOpen && (
        <LeadForm
          defaultComment={`${form.fromCity} → ${form.toCity}, ${form.weight} кг`}
          onSuccess={() => setLeadOpen(false)}
        />
      )}
    </section>
  );
}