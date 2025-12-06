import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useBookingStore } from "../../store/bookingStore";
import { useTranslation } from "react-i18next";

const HeroSearch: React.FC = () => {
  const { t } = useTranslation();
  const [fromCity, setFromCity] = React.useState("");
  const [toCity, setToCity] = React.useState("");
  const [date, setDate] = React.useState("");
  const setSearch = useBookingStore((s) => s.setSearch);
  const navigate = useNavigate();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSearch({ fromCity, toCity, date });
    navigate("/search");
  }

  return (
    <section className="relative py-16 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.h1
          className="text-3xl md:text-5xl font-bold mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {t("hero.title", "Book your next bus journey with confidence")}
        </motion.h1>
        <p className="mb-8 text-blue-100">
          {t("hero.subtitle", "Compare routes, choose seats, pay securely in seconds.")}
        </p>

        <motion.form
          onSubmit={onSubmit}
          className="bg-white/10 backdrop-blur-md rounded-xl p-4 grid grid-cols-1 md:grid-cols-4 gap-3 text-left"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <label className="text-sm text-blue-100">{t("labels.from", "From")}</label>
            <input
              value={fromCity}
              onChange={(e) => setFromCity(e.target.value)}
              className="mt-1 w-full rounded-md px-3 py-2 text-slate-900"
              placeholder={t("placeholders.fromCity", "Delhi")}
              required
            />
          </div>
          <div>
            <label className="text-sm text-blue-100">{t("labels.to", "To")}</label>
            <input
              value={toCity}
              onChange={(e) => setToCity(e.target.value)}
              className="mt-1 w-full rounded-md px-3 py-2 text-slate-900"
              placeholder={t("placeholders.toCity", "Mumbai")}
              required
            />
          </div>
          <div>
            <label className="text-sm text-blue-100">{t("labels.date", "Date")}</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 w-full rounded-md px-3 py-2 text-slate-900"
              required
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold py-2 rounded-md transition-colors"
            >
              {t("actions.searchBuses", "Search buses")}
            </button>
          </div>
        </motion.form>
      </div>
    </section>
  );
};

export default HeroSearch;