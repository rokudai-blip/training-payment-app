"use client";

import { useState, useMemo } from "react";

const RATES = [
  { id: 0,  course: "60分", plan: "月4回", timeType: "時間内", price: 3525 },
  { id: 1,  course: "60分", plan: "月4回", timeType: "時間外", price: 5525 },
  { id: 2,  course: "60分", plan: "月2回", timeType: "時間内", price: 3850 },
  { id: 3,  course: "60分", plan: "月2回", timeType: "時間外", price: 5850 },
  { id: 4,  course: "60分", plan: "月3回", timeType: "時間内", price: 3850 },
  { id: 5,  course: "60分", plan: "月3回", timeType: "時間外", price: 5850 },
  { id: 6,  course: "60分", plan: "月1回", timeType: "時間内", price: 4500 },
  { id: 7,  course: "60分", plan: "月1回", timeType: "時間外", price: 6500 },
  { id: 8,  course: "60分", plan: "回数券", timeType: "時間内", price: 5800 },
  { id: 9,  course: "60分", plan: "回数券", timeType: "時間外", price: 7800 },
  { id: 10, course: "80分", plan: "月4回", timeType: "時間内", price: 4825 },
  { id: 11, course: "80分", plan: "月4回", timeType: "時間外", price: 6825 },
  { id: 12, course: "80分", plan: "月2回", timeType: "時間内", price: 5150 },
  { id: 13, course: "80分", plan: "月2回", timeType: "時間外", price: 7150 },
  { id: 14, course: "80分", plan: "月3回", timeType: "時間内", price: 5150 },
  { id: 15, course: "80分", plan: "月3回", timeType: "時間外", price: 7150 },
  { id: 16, course: "80分", plan: "月1回", timeType: "時間内", price: 5800 },
  { id: 17, course: "80分", plan: "月1回", timeType: "時間外", price: 7800 },
  { id: 18, course: "80分", plan: "回数券", timeType: "時間内", price: 7100 },
  { id: 19, course: "80分", plan: "回数券", timeType: "時間外", price: 9100 },
];

const fmt = (n: number) => `¥${n.toLocaleString("ja-JP")}`;

const formatMonth = (m: string) => {
  if (!m) return "";
  const [y, mo] = m.split("-");
  return `${y}年${parseInt(mo)}月`;
};

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
};

const TimeBadge = ({ timeType }: { timeType: string }) => (
  <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap ${
    timeType === "時間内" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
  }`}>
    {timeType}
  </span>
);

export default function Home() {
  const [trainerName, setTrainerName] = useState("");
  const [paymentMonth, setPaymentMonth] = useState("");
  const [counts, setCounts] = useState<Record<number, number>>(
    Object.fromEntries(RATES.map((r) => [r.id, 0]))
  );

  const handleCount = (id: number, val: string) => {
    const n = Math.max(0, parseInt(val) || 0);
    setCounts((prev) => ({ ...prev, [id]: n }));
  };

  const { total, withholdingTax, transferAmount, totalSessions } = useMemo(() => {
    const total = RATES.reduce((s, r) => s + r.price * (counts[r.id] || 0), 0);
    const withholdingTax = Math.floor(total * 0.1021);
    const totalSessions = RATES.reduce((s, r) => s + (counts[r.id] || 0), 0);
    return { total, withholdingTax, transferAmount: total - withholdingTax, totalSessions };
  }, [counts]);

  const activeRates = RATES.filter((r) => (counts[r.id] || 0) > 0);
  const canPrint = trainerName && paymentMonth && total > 0;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* ── 画面表示 ── */}
      <div className="no-print max-w-3xl mx-auto py-6 px-4">
        {/* ヘッダー */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-5">
          <h1 className="text-xl font-bold text-gray-800 mb-0.5">報酬支払計算ツール</h1>
          <p className="text-xs text-gray-500">パーソナルトレーニング業務請負</p>
        </div>

        {/* 基本情報 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-5">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">基本情報</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">請負人名</label>
              <input
                type="text"
                value={trainerName}
                onChange={(e) => setTrainerName(e.target.value)}
                placeholder="例：山田 太郎"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">稼働月</label>
              <input
                type="month"
                value={paymentMonth}
                onChange={(e) => setPaymentMonth(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
        </div>

        {/* セッション入力 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-5">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">セッション入力</h2>

          {/* スマホ：カードレイアウト */}
          <div className="sm:hidden space-y-2">
            {RATES.map((r) => {
              const count = counts[r.id] || 0;
              const subtotal = r.price * count;
              return (
                <div
                  key={r.id}
                  className={`rounded-xl border p-3 transition-colors ${
                    count > 0 ? "border-blue-200 bg-blue-50" : "border-gray-100 bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="font-bold text-gray-700 text-sm whitespace-nowrap">{r.course}</span>
                      <span className="text-gray-600 text-sm whitespace-nowrap">{r.plan}</span>
                      <TimeBadge timeType={r.timeType} />
                    </div>
                    <input
                      type="number"
                      min={0}
                      value={count === 0 ? "" : count}
                      onChange={(e) => handleCount(r.id, e.target.value)}
                      placeholder="0"
                      className="w-14 shrink-0 text-center border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                    />
                  </div>
                  <div className="flex justify-between mt-1.5 text-xs text-gray-400">
                    <span>単価 {fmt(r.price)}</span>
                    <span className={subtotal > 0 ? "font-bold text-gray-700" : ""}>
                      {subtotal > 0 ? fmt(subtotal) : "—"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* PC：テーブルレイアウト */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs">
                  <th className="text-left px-3 py-2 rounded-tl-lg">コース</th>
                  <th className="text-left px-3 py-2">プラン</th>
                  <th className="text-left px-3 py-2">時間区分</th>
                  <th className="text-right px-3 py-2">単価</th>
                  <th className="text-center px-3 py-2">回数</th>
                  <th className="text-right px-3 py-2 rounded-tr-lg">小計</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {RATES.map((r) => {
                  const count = counts[r.id] || 0;
                  const subtotal = r.price * count;
                  return (
                    <tr key={r.id} className={count > 0 ? "bg-blue-50" : "hover:bg-gray-50"}>
                      <td className="px-3 py-2 font-medium text-gray-700">{r.course}</td>
                      <td className="px-3 py-2 text-gray-600">{r.plan}</td>
                      <td className="px-3 py-2"><TimeBadge timeType={r.timeType} /></td>
                      <td className="px-3 py-2 text-right text-gray-600">{fmt(r.price)}</td>
                      <td className="px-3 py-2 text-center">
                        <input
                          type="number"
                          min={0}
                          value={count === 0 ? "" : count}
                          onChange={(e) => handleCount(r.id, e.target.value)}
                          placeholder="0"
                          className="w-16 text-center border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                      </td>
                      <td className="px-3 py-2 text-right font-medium text-gray-800">
                        {subtotal > 0 ? fmt(subtotal) : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 計算結果 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-5">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">計算結果</h2>
          <div className="space-y-2">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600 text-sm">総コマ数</span>
              <span className="text-lg font-bold text-gray-800">{totalSessions} コマ</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600 text-sm">総額</span>
              <span className="text-xl font-bold text-gray-800">{fmt(total)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600 text-sm">
                源泉徴収額
                <span className="text-xs text-gray-400 ml-1">(10.21%・円未満切捨て)</span>
              </span>
              <span className="text-base font-semibold text-red-500">− {fmt(withholdingTax)}</span>
            </div>
            <div className="flex justify-between items-center py-3 bg-blue-50 rounded-xl px-3">
              <span className="font-bold text-gray-700">振込額</span>
              <span className="text-2xl font-bold text-blue-600">{fmt(transferAmount)}</span>
            </div>
          </div>
        </div>

        {/* PDF出力ボタン */}
        <div className="text-center pb-8">
          <button
            onClick={() => {
              const original = document.title;
              const [y, mo] = paymentMonth.split("-");
              document.title = `${y}.${parseInt(mo)}月分 ${trainerName}`;
              window.print();
              document.title = original;
            }}
            disabled={!canPrint}
            className={`px-10 py-3 rounded-xl font-bold text-white text-base shadow transition-all ${
              canPrint
                ? "bg-blue-600 hover:bg-blue-700 active:scale-95"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            PDF出力
          </button>
          {!canPrint && (
            <p className="text-xs text-gray-400 mt-2">
              請負人名・支払月を入力し、1件以上セッション回数を入力してください
            </p>
          )}
        </div>
      </div>

      {/* ── 印刷用レイアウト ── */}
      <div className="print-only print-container">
        <div style={{ borderBottom: "3px solid #1d4ed8", paddingBottom: "12px", marginBottom: "24px" }}>
          <h1 style={{ fontSize: "22px", fontWeight: "bold", color: "#1d4ed8", margin: 0 }}>
            報酬支払明細書
          </h1>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px", fontSize: "14px" }}>
          <div>
            <p style={{ margin: "4px 0", color: "#555" }}>稼働月</p>
            <p style={{ margin: "4px 0", fontSize: "18px", fontWeight: "bold" }}>{formatMonth(paymentMonth)}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ margin: "4px 0", color: "#555" }}>請負人名</p>
            <p style={{ margin: "4px 0", fontSize: "18px", fontWeight: "bold" }}>{trainerName} 様</p>
          </div>
        </div>

        {activeRates.length > 0 && (
          <div style={{ marginBottom: "24px" }}>
            <p style={{ fontSize: "12px", color: "#555", marginBottom: "8px", fontWeight: "bold" }}>セッション明細</p>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ backgroundColor: "#eff6ff" }}>
                  <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>コース</th>
                  <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>プラン</th>
                  <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>時間区分</th>
                  <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>単価</th>
                  <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>回数</th>
                  <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>小計</th>
                </tr>
              </thead>
              <tbody>
                {activeRates.map((r) => (
                  <tr key={r.id}>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>{r.course}</td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>{r.plan}</td>
                    <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>{r.timeType}</td>
                    <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>{fmt(r.price)}</td>
                    <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>{counts[r.id]}</td>
                    <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right", fontWeight: "bold" }}>
                      {fmt(r.price * counts[r.id])}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div style={{ marginLeft: "auto", maxWidth: "320px", fontSize: "14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #eee" }}>
            <span style={{ color: "#555" }}>総コマ数</span>
            <span style={{ fontWeight: "bold" }}>{totalSessions} コマ</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #eee" }}>
            <span style={{ color: "#555" }}>総額</span>
            <span style={{ fontWeight: "bold" }}>{fmt(total)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #eee" }}>
            <span style={{ color: "#555" }}>源泉徴収額（10.21%）</span>
            <span style={{ color: "#c00", fontWeight: "bold" }}>− {fmt(withholdingTax)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 8px", backgroundColor: "#eff6ff", borderRadius: "8px", marginTop: "8px" }}>
            <span style={{ fontWeight: "bold", fontSize: "16px" }}>振込額</span>
            <span style={{ fontWeight: "bold", fontSize: "20px", color: "#1d4ed8" }}>{fmt(transferAmount)}</span>
          </div>
        </div>

        <div style={{ marginTop: "40px", fontSize: "12px", color: "#888", textAlign: "right" }}>
          発行日：{today()}
        </div>
      </div>
    </div>
  );
}
