export function UserHomePage() {
  const stats = [
    {
      title: "Balance",
      amount: "$1,240",
      sub: "Trong 3 tài khoản",
    },
    {
      title: "This Month Income",
      amount: "$3,200",
      sub: "+$400 vs tháng trước",
    },
    {
      title: "This Month Expense",
      amount: "$1,960",
      sub: "Còn lại $1,240 ngân sách",
    }
  ];

  const recent = [
    { label: "Coffee", amount: -4.5 },
    { label: "Salary", amount: 1500 },
    { label: "Groceries", amount: -42.9 },
  ];

  return (
    <div className="flex flex-col gap-10">

      {/* GREETING */}
      <h1 className="text-3xl font-bold tracking-tight">
        Good morning, <span className="text-blue-500">welcome back!</span>
      </h1>

      {/* TOP CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((box, i) => (
          <div
            key={i}
            className="rounded-2xl border bg-card/60 p-6 shadow-sm hover:shadow-md transition"
          >
            <p className="text-sm text-muted-foreground">{box.title}</p>
            <p className="text-3xl font-bold mt-2">{box.amount}</p>
            <p className="text-sm text-muted-foreground mt-1">{box.sub}</p>
          </div>
        ))}
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* WEEKLY */}
        <div className="lg:col-span-2 rounded-2xl border bg-card/60 p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Weekly Spending</h2>

          <div className="h-64 rounded-xl bg-muted/30 p-4 flex items-end gap-2">
            <div className="h-20 w-full bg-blue-600/70 rounded-md"></div>
            <div className="h-28 w-full bg-blue-600/70 rounded-md"></div>
            <div className="h-36 w-full bg-blue-600/70 rounded-md"></div>
            <div className="h-48 w-full bg-blue-600/70 rounded-md"></div>
            <div className="h-40 w-full bg-blue-600/70 rounded-md"></div>
            <div className="h-28 w-full bg-blue-600/70 rounded-md"></div>
            <div className="h-16 w-full bg-blue-600/70 rounded-md"></div>
          </div>

          <p className="text-sm text-muted-foreground mt-3">
            Chi tiêu 7 ngày gần nhất.
          </p>
        </div>

        {/* RECENT */}
        <div className="rounded-2xl border bg-card/60 p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>

          <div className="flex flex-col gap-4">
            {recent.map((t, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span>{t.label}</span>
                <span
                  className={
                    t.amount >= 0 ? "text-green-500" : "text-red-500"
                  }
                >
                  {t.amount >= 0 ? `+ $${t.amount}` : `- $${Math.abs(t.amount)}`}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
