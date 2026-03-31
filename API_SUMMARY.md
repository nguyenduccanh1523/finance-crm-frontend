# Budget & Goal Analytics API Summary

> **Phiên bản**: 2.0 - Multi-Currency Support  
> **Cập nhật lần cuối**: 27/03/2026
>
> ✅ = Đã implement & sử dụng được  
> ⚠️ = Implement một phần (chưa dùng được)
> ❌ = Chưa implement
>
> **📌 CHÚ Ý QUAN TRỌNG:**
>
> - Tất cả endpoint CRUD (GET/POST/PATCH/DELETE) đều **bắt buộc accountId**
> - Currency **tự động từ account** (không truyền vào request)
> - **Allocate**: Check account.balance; **Withdraw**: Check goal.balance (khác biệt quan trọng!)
> - Analytics endpoint có thể cần convert multi-currency

---

## 🎯 Các API cho giao diện Frontend

### 1. 💰 BUDGET APIs - CRUD & Analytics

#### ✅ GET `/personal/budgets`

**Lấy danh sách tất cả budgets của workspace**

```typescript
Response 200: {
    "statusCode": 200,
    "message": "Success",
    "data": [
        {
            "id": "e9a3bbcf-53c5-4ed7-bcf5-f1724b298abb",
            "createdAt": "2026-03-27T03:00:31.099Z",
            "updatedAt": "2026-03-27T03:00:31.099Z",
            "workspaceId": "a9aa6802-1940-4c22-b45e-75b62abef55e",
            "accountId": "d6c61a91-f8ab-4e94-baaf-4a210c8ad8d8",
            "periodMonth": "2026-04-01",
            "categoryId": "05e52e2d-c247-45bf-9a30-b63e0cd3517b",
            "amountLimitCents": "2000000",
            "currency": "VND",
            "alertThresholdPercent": 90
        },
        {
            "id": "9c75dcc6-c93c-46d8-99df-2dfbb3f3edf0",
            "createdAt": "2026-03-27T03:11:08.287Z",
            "updatedAt": "2026-03-27T03:31:16.714Z",
            "workspaceId": "a9aa6802-1940-4c22-b45e-75b62abef55e",
            "accountId": "c86dbec1-8505-4ce5-8416-871903d1d3d5",
            "periodMonth": "2026-04-01",
            "categoryId": "05e52e2d-c247-45bf-9a30-b63e0cd3517b",
            "amountLimitCents": "2000000",
            "currency": "VND",
            "alertThresholdPercent": 90
        }
    ]
}
```

**Use case**: Hiển thị danh sách budgets trên dashboard

---

#### ✅ GET `/personal/budgets/:id`

**Lấy chi tiết 1 budget cụ thể**

```typescript
Response 200: {
    "statusCode": 200,
    "message": "Success",
    "data": {
        "id": "e9a3bbcf-53c5-4ed7-bcf5-f1724b298abb",
        "createdAt": "2026-03-27T03:00:31.099Z",
        "updatedAt": "2026-03-27T03:00:31.099Z",
        "workspaceId": "a9aa6802-1940-4c22-b45e-75b62abef55e",
        "accountId": "d6c61a91-f8ab-4e94-baaf-4a210c8ad8d8",
        "periodMonth": "2026-04-01",
        "categoryId": "05e52e2d-c247-45bf-9a30-b63e0cd3517b",
        "amountLimitCents": "2000000",
        "currency": "VND",
        "alertThresholdPercent": 90
    }
}

Response 404: {
    "statusCode": 404,
    "message": "Không tìm thấy tài nguyên.",
    "path": "/api/personal/budgets/8ee1068d-d36a-492b-bbdb-9df20aa8257b",
    "timestamp": "2026-03-31T16:42:06.932Z"
}
```

**Use case**: Chi tiết budget khi user click vào danh sách

---

#### ✅ POST `/personal/budgets`

**Tạo ngân sách mới (multi-currency)**

```typescript
Request: {
  categoryId: string;
  periodMonth: string;          // "2026-03-01"
  amountLimitCents: number;     // 💰 SỐ TIỀN TỐI ĐA được chi/tháng
  accountId?: string;           // ← NEW: Nếu không có, dùng primary account
  alertThresholdPercent?: number; // default: 80
}

Response 201: {
    "id": "8ee1068d-d36a-492b-bbdb-9df20aa8257b",
    "createdAt": "2026-03-26T04:36:30.691Z",
    "updatedAt": "2026-03-26T04:36:30.691Z",
    "workspaceId": "a9aa6802-1940-4c22-b45e-75b62abef55e",
    "accountId": "acc-123-vnd",      // ← NEW: Ngân sách liên kết account
    "periodMonth": "2026-04-01",
    "categoryId": "05e52e2d-c247-45bf-9a30-b63e0cd3517b",
    "amountLimitCents": 2000000,
    "currency": "VND",              // ← NEW: Tự động từ account.currency
    "alertThresholdPercent": 90
}
```

**Key Points:**

- `accountId`: Tự động từ account primary nếu không truyền
- `currency`: Tự động từ account (không thể thay đổi)
- Một budget liên kết với 1 account, 1 currency

**Use case**: Tạo ngân sách mới cho category trong một account cụ thể

---

#### ✅ PATCH `/personal/budgets/:id`

**Cập nhật ngân sách**

```typescript
Request: {
  amountLimitCents?: number;
  alertThresholdPercent?: number;
}

Response 200: {
  id: string;
  amountLimitCents: number;
  alertThresholdPercent: number;
  updatedAt: Date;
}
```

**Use case**: Điều chỉnh giới hạn ngân sách

---

#### ✅ DELETE `/personal/budgets/:id`

**Xóa ngân sách**

```typescript
Response 200: {
  ok: true;
  deletedAt: Date;
}
```

**Use case**: Xóa budget không dùng nữa

---

#### ✅ GET `/personal/analytics/budgets`

**Phân tích tất cả budgets (dashboard overview)**

```typescript
Response 200: {
    "statusCode": 200,
    "message": "Success",
    "data": {
        "totalBudgetCents": 4000000,
        "totalSpentCents": 0,
        "totalRemainingCents": 4000000,
        "averageUtilization": "0.00",
        "budgetsOnTrack": 2,
        "budgetsWarning": 0,
        "budgetsExceeded": 0,
        "spendingTrend": "STABLE",
        "trendPercentage": 0,
        "details": [
            {
                "budgetId": "e9a3bbcf-53c5-4ed7-bcf5-f1724b298abb",
                "categoryId": "05e52e2d-c247-45bf-9a30-b63e0cd3517b",
                "categoryName": "Food",
                "limitCents": 2000000,
                "limitFormatted": "₫2.000.000",
                "spentCents": 0,
                "spentFormatted": "₫0",
                "percentageUsed": 0,
                "remainingCents": 2000000,
                "remainingFormatted": "₫2.000.000",
                "status": "ON_TRACK",
                "statusColor": "#10b981",
                "prediction": {
                    "predictedSpendFormatted": "₫0",
                    "overagePercentage": -100,
                    "isOverBudget": false,
                    "trendDirection": "STABLE",
                    "trendIcon": "➡️",
                    "confidence": 0,
                    "message": "✅ Dự đoán an toàn"
                },
                "daysLeftInMonth": 29
            },
            {
                "budgetId": "9c75dcc6-c93c-46d8-99df-2dfbb3f3edf0",
                "categoryId": "05e52e2d-c247-45bf-9a30-b63e0cd3517b",
                "categoryName": "Food",
                "limitCents": 2000000,
                "limitFormatted": "₫2.000.000",
                "spentCents": 0,
                "spentFormatted": "₫0",
                "percentageUsed": 0,
                "remainingCents": 2000000,
                "remainingFormatted": "₫2.000.000",
                "status": "ON_TRACK",
                "statusColor": "#10b981",
                "prediction": {
                    "predictedSpendFormatted": "₫0",
                    "overagePercentage": -100,
                    "isOverBudget": false,
                    "trendDirection": "STABLE",
                    "trendIcon": "➡️",
                    "confidence": 0,
                    "message": "✅ Dự đoán an toàn"
                },
                "daysLeftInMonth": 29
            }
        ]
    }
}
```

**Use case**: Dashboard tổng quan budget

---

#### ✅ GET `/personal/analytics/budgets/:id/prediction`

**Dự báo vượt budget nếu giữ tốc độ chi tiêu**

```typescript
Response 200: {
    "statusCode": 200,
    "message": "Success",
    "data": {
        "budgetId": "e9a3bbcf-53c5-4ed7-bcf5-f1724b298abb",
        "predictedSpendCents": 0,
        "overagePercentage": -100,
        "isOverBudget": false,
        "trendDirection": "STABLE",
        "confidence": 0
    }
}
```

**Use case**: Cảnh báo "Nếu tiếp tục chi như vậy, bạn sẽ vượt budget vào ngày..."

---

#### ✅ GET `/personal/analytics/anomalies`

**Phát hiện bất thường trong chi tiêu**

```typescript
Response 200: {
  anomalies: [
    {
      id: string;
      type: 'SPENDING_SPIKE' | 'UNUSUAL_PATTERN' | 'CATEGORY_OVERSPEND';
      severity: 'LOW' | 'MEDIUM' | 'HIGH';
      budgetId: string;
      categoryId: string;
      message: string;
      details: string;
      suggestedAction: string;
      timestamp: Date;
    }
  ];
}
```

**Use case**: Cảnh báo bất thường

---

#### ✅ GET `/personal/transactions/linked-to-budget/:budgetId`

**Lấy các giao dịch được tính vào budget**

```typescript
Response 200: {
  statusCode: 200;
  message: 'Success';
  budgetId: string;
  transactions: [
    {
      id: string;
      date: Date;
      amount: number;
      categoryName: string;
      note: string;
      type: 'EXPENSE';
    }
  ];
}
```

**Use case**: Chi tiết các chi tiêu tính vào budget

---

### 2. 🎯 GOAL APIs - CRUD & Transaction

#### ✅ GET `/personal/goals`

**Lấy danh sách tất cả goals của workspace**

```typescript
Response 200: {
    "statusCode": 200,
    "message": "Success",
    "data": [
        {
            "id": "90070a0c-a709-4dc3-9834-a0e2e7c87a54",
            "createdAt": "2026-03-27T03:40:06.723Z",
            "updatedAt": "2026-03-28T12:42:30.907Z",
            "deletedAt": null,
            "workspaceId": "a9aa6802-1940-4c22-b45e-75b62abef55e",
            "accountId": "c86dbec1-8505-4ce5-8416-871903d1d3d5",
            "name": "Ip 17",
            "targetAmountCents": "50000000",
            "targetDate": "2026-12-08",
            "currentAmountCents": "1000000",
            "currency": "VND",
            "status": "ACTIVE"
        },
        {
            "id": "01bd5041-4c30-43ae-8bbd-6f4ff6ed320d",
            "createdAt": "2026-03-27T03:38:55.853Z",
            "updatedAt": "2026-03-27T03:38:55.853Z",
            "deletedAt": null,
            "workspaceId": "a9aa6802-1940-4c22-b45e-75b62abef55e",
            "accountId": "d6c61a91-f8ab-4e94-baaf-4a210c8ad8d8",
            "name": "Macbook",
            "targetAmountCents": "50000000",
            "targetDate": "2026-12-08",
            "currentAmountCents": "5000000",
            "currency": "VND",
            "status": "ACTIVE"
        }
    ]
}
```

**Use case**: Danh sách goals trên dashboard

---

#### ✅ GET `/personal/goals/:id`

**Chi tiết một goal**

```typescript
Response 200: {
    "statusCode": 200,
    "message": "Success",
    "data": {
        "id": "90070a0c-a709-4dc3-9834-a0e2e7c87a54",
        "createdAt": "2026-03-27T03:40:06.723Z",
        "updatedAt": "2026-03-28T12:42:30.907Z",
        "deletedAt": null,
        "workspaceId": "a9aa6802-1940-4c22-b45e-75b62abef55e",
        "accountId": "c86dbec1-8505-4ce5-8416-871903d1d3d5",
        "name": "Ip 17",
        "targetAmountCents": "50000000",
        "targetDate": "2026-12-08",
        "currentAmountCents": "1000000",
        "currency": "VND",
        "status": "ACTIVE"
    }
}

Response 404: {
  statusCode: 404;
  message: 'Goal not found';
}
```

**Use case**: Chi tiết mục tiêu khi user click vào

---

#### ✅ POST `/personal/goals`

**Tạo mục tiêu mới (multi-currency)**

```typescript
Request: {
  name: string;
  description?: string;
  targetAmountCents: number;
  targetDate: Date;
  accountId?: string;           // ← NEW: Nếu không có, dùng primary account
  currentAmountCents?: number;  // default: 0
}

Response 201: {
  id: string;
  name: string;
  targetAmountCents: number;
  currentAmountCents: number;
  currency: "VND",              // ← NEW: Tự động từ account.currency
  accountId: "acc-123-vnd",     // ← NEW: Ngân sách liên kết account
  targetDate: Date;
  createdAt: Date;
}
```

**Key Points:**

- `accountId`: Tự động từ account primary nếu không truyền
- `currency`: Tự động từ account (không thể thay đổi)
- Một goal liên kết với 1 account, 1 currency
- Nếu thiếu account, hệ thống tự lấy account primary

**Use case**: Tạo goal mới và liên kết với account cụ thể

---

#### ✅ PATCH `/personal/goals/:id`

**Cập nhật mục tiêu**

```typescript
Request: {
  name?: string;
  description?: string;
  targetAmountCents?: number;
  targetDate?: Date;
}

Response 200: {
  id: string;
  name: string;
  description: string;
  targetAmountCents: number;
  targetDate: Date;
  updatedAt: Date;
}
```

**Use case**: Chỉnh sửa goal

---

#### ✅ DELETE `/personal/goals/:id`

**Xóa mục tiêu (soft delete)**

```typescript
Response 200: {
  ok: true;
  deletedAt: Date;
}
```

**Use case**: Xóa goal không dùng nữa

---

#### ✅ POST `/personal/goals/:id/allocate`

**Phân bổ tiền từ account vào goal (multi-currency)**

```typescript
Request: {
  amountCents: number;  // ₫ hoặc USD, etc
}

Response 200: {
  goalId: string;
  previousBalance: number;
  newBalance: number;
  allocatedAmount: number;
  currency: "VND",              // ← Show user: currency của goal
  accountId: "acc-123-vnd",     // ← Nếu cần track
  transactionType: 'GOAL_ALLOCATION';
  createdAt: Date;
}
```

**Logic (CHÚ Ý):**

1. ✅ Load goal để lấy account_id & currency
2. ✅ Load account (từ goal.account_id)
3. 🔴 **CHECK account.currentBalance >= amountCents** ← CRITICAL
   - Nếu thiếu → throw Error("Số dư tài khoản không đủ")
4. Update: goal.currentAmount += amountCents
5. Update: account.currentBalance -= amountCents
6. Save both entities

**Use case**:

- User phân bổ tiền từ account vào goal
- Ví dụ: Allocate USD 500 from account vào Travel Fund goal
- Dữ liệu tự động cùng currency (không cần convert)

---

#### ✅ POST `/personal/goals/:id/withdraw`

**Rút tiền từ goal về account (multi-currency)**

```typescript
Request: {
  amountCents: number;  // ₫ hoặc USD, etc
}

Response 200: {
  goalId: string;
  previousBalance: number;
  newBalance: number;
  withdrawnAmount: number;
  currency: "VND",              // ← Show user: currency của goal
  accountId: "acc-123-vnd",     // ← Nếu cần track
  transactionType: 'GOAL_WITHDRAWAL';
  createdAt: Date;
}
```

**Logic (CHÚ Ý - khác allocate!):**

1. ✅ Load goal để lấy account_id & currency
2. 🔴 **CHECK goal.currentAmount >= amountCents** ← CRITICAL
   - Nếu thiếu → throw Error("Số dư mục tiêu không đủ")
   - ⚠️ NOT account! Check goal balance!
3. Load account (để update)
4. Update: goal.currentAmount -= amountCents
5. Update: account.currentBalance += amountCents
6. Save both entities

**Khác biệt với Allocate:**

- **Allocate**: Check account.balance (source) ✅
- **Withdraw**: Check goal.balance (source) ✅

**Use case**:

- User rút tiền từ goal khi cần
- Ví dụ: Withdraw USD 200 từ Travel Fund goal
- Dữ liệu tự động cùng currency (không cần convert)

---

#### ✅ GET `/personal/transactions/linked-to-goal/:goalId`

**Lấy các giao dịch liên kết goal (allocate/withdraw)**

```typescript
Response 200: {
    "statusCode": 200,
    "message": "Success",
    "goalId": "90070a0c-a709-4dc3-9834-a0e2e7c87a54",
    "transactions": [
        {
            "id": "ba08c95e-b7ca-44ab-8439-99502b15baba",
            "createdAt": "2026-03-28T12:42:30.937Z",
            "updatedAt": "2026-03-28T12:42:30.937Z",
            "deletedAt": null,
            "workspaceId": "a9aa6802-1940-4c22-b45e-75b62abef55e",
            "workspace": {
                "id": "a9aa6802-1940-4c22-b45e-75b62abef55e",
                "name": "My Personal Finance123",
                "timezone": "Asia/Ho_Chi_Minh",
                "defaultCurrency": "USD"
            },
            "accountId": "c86dbec1-8505-4ce5-8416-871903d1d3d5",
            "account": {
                "id": "c86dbec1-8505-4ce5-8416-871903d1d3d5",
                "name": "Timo Bank",
                "type": "CASH",
                "currency": "VND",
                "openingBalanceCents": "30000000",
                "currentBalanceCents": "29000000"
            },
            "transactionTags": [],
            "type": "GOAL_WITHDRAWAL",
            "amountCents": "1000000",
            "currency": "VND",
            "occurredAt": "2026-03-28T12:42:30.936Z",
            "categoryId": null,
            "category": null,
            "note": "Withdraw from Ip 17",
            "counterparty": null,
            "transferAccountId": null,
            "tags": []
        }
    ]
}
```

**Use case**: Lịch sử phân bổ/rút tiền từ goal

---

### 3. 💡 INSIGHTS & SUGGESTIONS APIs

#### ✅ GET `/personal/analytics/insights`

**Lấy tất cả insights cho workspace**

```typescript
Response 200: {
    "statusCode": 200,
    "message": "Success",
    "data": [
        {
            "id": "d4ffe175-ee1d-482b-a2da-0b31bf6ae5a7",
            "type": "PATTERN",
            "typeIcon": "📊",
            "title": "💰 Chi phí lớn nhất",
            "description": "Food chiếm 100.0% tổng chi tiêu",
            "metric": "100.0% từ Food",
            "actionable": true,
            "priority": "HIGH",
            "priorityColor": "#ef4444",
            "timestamp": "23:46:10 31/3/2026"
        },
        {
            "id": "5e5c9958-a843-4183-9387-1658cfe65648",
            "type": "ACHIEVEMENT",
            "typeIcon": "🎉",
            "title": "🎉 Tiết kiệm thành công!",
            "description": "Bạn đã tiết kiệm được ₫4.000.000",
            "metric": "Tiết kiệm ₫4.000.000",
            "actionable": false,
            "priority": "LOW",
            "priorityColor": "#10b981",
            "timestamp": "23:46:10 31/3/2026"
        }
    ]
}
```

**Use case**: Hiển thị insights trên dashboard

**Ví dụ insights:**

- "📈 Chi tiêu tăng 18% so với tháng trước"
- "🚨 Nếu tiếp tục, bạn sẽ vượt budget Marketing vào ngày 28/3"
- "💡 Bạn tiết kiệm được ₫500k so với tháng trước"

---

#### ✅ GET `/personal/analytics/suggestions`

**Lấy gợi ý hành động**

```typescript
Response 200: {
    "statusCode": 200,
    "message": "Success",
    "data": [
        {
            "id": "3eed9b6a-fef7-40ea-b21d-ecfabf1b79de",
            "title": "🚀 Đánh giá lại subscriptions",
            "description": "Kiểm tra các dịch vụ subscription không cần thiết",
            "impact": "POSITIVE",
            "impactIcon": "✅",
            "estimatedResult": "Có thể tiết kiệm 10-30%",
            "difficulty": "EASY",
            "difficultyColor": "#10b981"
        },
        {
            "id": "e9719dc8-c5fc-4692-99c9-b5b614f82408",
            "title": "📊 Xây dựng hệ thống tracking chi tiết",
            "description": "Theo dõi chi tiêu theo project/công việc để tối ưu hóa tốt hơn",
            "impact": "POSITIVE",
            "impactIcon": "✅",
            "estimatedResult": "Cải thiện kiểm soát chi phí 20-30%",
            "difficulty": "MEDIUM",
            "difficultyColor": "#f59e0b"
        },
        {
            "id": "5f9df24d-50ec-4b34-8e83-3aa98af11bbe",
            "title": "💼 Review quy trình mua hàng",
            "description": "Tới tâm hóa quy trình approval để tiết kiệm",
            "impact": "POSITIVE",
            "impactIcon": "✅",
            "estimatedResult": "Tiết kiệm 5-15% chi phí",
            "difficulty": "HARD",
            "difficultyColor": "#ef4444"
        },
        {
            "id": "8043ebb2-5216-4e0b-9200-ce615c4a52ea",
            "title": "🚀 Bật thông báo ngân sách",
            "description": "Nhận cảnh báo khi sắp vượt budget",
            "impact": "NEUTRAL",
            "impactIcon": "➡️",
            "difficulty": "EASY",
            "difficultyColor": "#10b981"
        }
    ]
}
```

**Use case**: Gợi ý tối ưu hóa ngân sách/goal

---

#### ✅ GET `/personal/analytics/optimization`

**Gợi ý tối ưu hóa ngân sách dựa trên chi tiêu thực tế**

```typescript
Response 200: {
  statusCode: 200;
  message: 'Success';
  workspaceId: string;
  suggestions: [
    {
      budgetId: string;
      categoryId: string;
      currentLimit: number;
      recommendedLimit: number;
      reason: string;       // VD: "Chi tiêu đạt 95%"
      potentialSavings: number;
      priority: 'URGENT' | 'MEDIUM' | 'LOW';
    }
  ];
  summary: {
    totalSuggestions: number;
    urgentCount: number;
    potentialSavings: number;
  };
}
```

**Use case**: Gợi ý điều chỉnh ngân sách các loại dựa trên chi tiêu thực tế

---

#### ✅ GET `/personal/analytics/goal-strategy/:goalId`

**Lấy gợi ý chiến lược cho mục tiêu**

```typescript
Response 200: {
    "statusCode": 200,
    "message": "Success",
    "goalId": "01bd5041-4c30-43ae-8bbd-6f4ff6ed320d",
    "suggestions": [
        {
            "id": "01bd5041-4c30-43ae-8bbd-6f4ff6ed320d-speed-up",
            "title": "Cần tăng tốc độ phân bổ tiền",
            "description": "Để đạt target vào 12/8/2026, bạn cần phân bổ ₫178,572 mỗi ngày (tăng 800.0% so với hiện tại)",
            "impact": "POSITIVE",
            "difficulty": "HARD",
            "estimatedResult": "Hoàn thành goal đúng hạn hoặc sớm hơn"
        },
        {
            "id": "01bd5041-4c30-43ae-8bbd-6f4ff6ed320d-weekly-plan",
            "title": "Lên kế hoạch phân bổ hàng tuần",
            "description": "Phân bổ khoảng ₫1,250,000 mỗi tuần sẽ giúp bạn đạt mục tiêu",
            "impact": "POSITIVE",
            "difficulty": "EASY",
            "estimatedResult": "Theo dõi tiến độ dễ dàng hơn"
        }
    ],
    "summary": {
        "totalSuggestions": 2,
        "easyCount": 1,
        "hardCount": 1
    }
}
```

**Use case**: Gợi ý cách đạt goal nhanh hơn

---

#### ✅ GET `/personal/analytics/dashboard`

**Lấy toàn bộ dashboard data (all-in-one)**

```typescript
Response 200: {
    "statusCode": 200,
    "message": "Success",
    "data": {
        "budgets": [
            {
                "budgetId": "e9a3bbcf-53c5-4ed7-bcf5-f1724b298abb",
                "categoryId": "05e52e2d-c247-45bf-9a30-b63e0cd3517b",
                "categoryName": "Food",
                "limitCents": 2000000,
                "limitFormatted": "₫2.000.000",
                "spentCents": 0,
                "spentFormatted": "₫0",
                "percentageUsed": 0,
                "remainingCents": 2000000,
                "remainingFormatted": "₫2.000.000",
                "status": "ON_TRACK",
                "statusColor": "#10b981",
                "daysLeftInMonth": 29
            },
            {
                "budgetId": "9c75dcc6-c93c-46d8-99df-2dfbb3f3edf0",
                "categoryId": "05e52e2d-c247-45bf-9a30-b63e0cd3517b",
                "categoryName": "Food",
                "limitCents": 2000000,
                "limitFormatted": "₫2.000.000",
                "spentCents": 0,
                "spentFormatted": "₫0",
                "percentageUsed": 0,
                "remainingCents": 2000000,
                "remainingFormatted": "₫2.000.000",
                "status": "ON_TRACK",
                "statusColor": "#10b981",
                "daysLeftInMonth": 29
            }
        ],
        "goals": [
            {
                "goalId": "01bd5041-4c30-43ae-8bbd-6f4ff6ed320d",
                "name": "Macbook",
                "targetAmountFormatted": "₫50000000",
                "currentAmountFormatted": "₫5000000",
                "amountNeededFormatted": "₫45.000.000",
                "percentageAchieved": 10,
                "status": "BEHIND",
                "statusIcon": "⚠️",
                "daysLeft": 252,
                "estimatedCompletionDate": "13/9/275760",
                "isAheadSchedule": false,
                "velocityPerDayFormatted": "₫0/ngày",
                "motivationalMessage": "Cần tăng tốc độ để hoàn thành đúng hạn"
            },
            {
                "goalId": "90070a0c-a709-4dc3-9834-a0e2e7c87a54",
                "name": "Ip 17",
                "targetAmountFormatted": "₫50000000",
                "currentAmountFormatted": "₫1000000",
                "amountNeededFormatted": "₫49.000.000",
                "percentageAchieved": 2,
                "status": "BEHIND",
                "statusIcon": "⚠️",
                "daysLeft": 252,
                "estimatedCompletionDate": "13/9/275760",
                "isAheadSchedule": false,
                "velocityPerDayFormatted": "₫0/ngày",
                "motivationalMessage": "Cần tăng tốc độ để hoàn thành đúng hạn"
            }
        ],
        "insights": [
            {
                "id": "5b12338b-47de-4b4b-9149-3b8da744a303",
                "type": "PATTERN",
                "typeIcon": "📊",
                "title": "💰 Chi phí lớn nhất",
                "description": "Food chiếm 100.0% tổng chi tiêu",
                "metric": "100.0% từ Food",
                "actionable": true,
                "priority": "HIGH",
                "priorityColor": "#ef4444",
                "timestamp": "23:47:21 31/3/2026"
            },
            {
                "id": "cb313c6b-c0e5-4ff9-b31b-2c37a74633df",
                "type": "ACHIEVEMENT",
                "typeIcon": "🎉",
                "title": "🎉 Tiết kiệm thành công!",
                "description": "Bạn đã tiết kiệm được ₫4.000.000",
                "metric": "Tiết kiệm ₫4.000.000",
                "actionable": false,
                "priority": "LOW",
                "priorityColor": "#10b981",
                "timestamp": "23:47:21 31/3/2026"
            }
        ],
        "anomalies": [],
        "suggestions": [
            {
                "id": "92a11713-2956-41bd-a7e6-6eef69664739",
                "title": "🚀 Đánh giá lại subscriptions",
                "description": "Kiểm tra các dịch vụ subscription không cần thiết",
                "impact": "POSITIVE",
                "impactIcon": "✅",
                "estimatedResult": "Có thể tiết kiệm 10-30%",
                "difficulty": "EASY",
                "difficultyColor": "#10b981"
            },
            {
                "id": "5ba3c101-02fb-445f-8997-79eb14465906",
                "title": "📊 Xây dựng hệ thống tracking chi tiết",
                "description": "Theo dõi chi tiêu theo project/công việc để tối ưu hóa tốt hơn",
                "impact": "POSITIVE",
                "impactIcon": "✅",
                "estimatedResult": "Cải thiện kiểm soát chi phí 20-30%",
                "difficulty": "MEDIUM",
                "difficultyColor": "#f59e0b"
            },
            {
                "id": "b94d0d99-3681-454c-a956-db8d8c2a96fe",
                "title": "💼 Review quy trình mua hàng",
                "description": "Tới tâm hóa quy trình approval để tiết kiệm",
                "impact": "POSITIVE",
                "impactIcon": "✅",
                "estimatedResult": "Tiết kiệm 5-15% chi phí",
                "difficulty": "HARD",
                "difficultyColor": "#ef4444"
            },
            {
                "id": "111574df-21c8-4855-83ff-67ffbc5d0c60",
                "title": "🚀 Bật thông báo ngân sách",
                "description": "Nhận cảnh báo khi sắp vượt budget",
                "impact": "NEUTRAL",
                "impactIcon": "➡️",
                "difficulty": "EASY",
                "difficultyColor": "#10b981"
            }
        ],
        "gamification": {
            "totalPoints": 2500,
            "pointsFormatted": "2.500 điểm",
            "level": 3,
            "nextLevelPoints": 3500,
            "pointsToNextLevel": 1000,
            "levelProgressPercentage": 71.42857142857143,
            "currentStreak": 7,
            "streakMessage": "🔥 7 ngày liên tiếp",
            "achievements": [
                {
                    "id": "ach_first_budget",
                    "type": "MILESTONE",
                    "title": "Bước đầu tiên",
                    "description": "Tạo ngân sách đầu tiên",
                    "icon": "🏆",
                    "unlockedAt": "23:47:21 31/3/2026",
                    "isUnlocked": true
                },
                {
                    "id": "ach_budget_master",
                    "type": "MILESTONE",
                    "title": "Chủ nhân ngân sách",
                    "description": "Tạo 10 ngân sách",
                    "icon": "🏆",
                    "isUnlocked": false
                },
                {
                    "id": "ach_goal_achiever",
                    "type": "MILESTONE",
                    "title": "Người đạt mục tiêu",
                    "description": "Hoàn thành 1 mục tiêu tài chính",
                    "icon": "🏆",
                    "unlockedAt": "23:47:21 31/3/2026",
                    "isUnlocked": true
                },
                {
                    "id": "ach_goal_superstar",
                    "type": "MILESTONE",
                    "title": "Siêu sao mục tiêu",
                    "description": "Hoàn thành 5 mục tiêu tài chính",
                    "icon": "🏆",
                    "isUnlocked": false
                },
                {
                    "id": "ach_on_budget",
                    "type": "BEHAVIOR",
                    "title": "Kiểm soát chi tiêu",
                    "description": "Không vượt budget 1 tuần",
                    "icon": "📈",
                    "unlockedAt": "23:47:21 31/3/2026",
                    "isUnlocked": true
                },
                {
                    "id": "ach_frugal_king",
                    "type": "BEHAVIOR",
                    "title": "Vua tiết kiệm",
                    "description": "Không vượt budget 1 tháng",
                    "icon": "📈",
                    "isUnlocked": false
                },
                {
                    "id": "ach_7day_streak",
                    "type": "STREAK",
                    "title": "Cháy tuần",
                    "description": "7 ngày liên tiếp không vượt budget",
                    "icon": "🔥",
                    "unlockedAt": "23:47:21 31/3/2026",
                    "isUnlocked": true
                },
                {
                    "id": "ach_30day_streak",
                    "type": "STREAK",
                    "title": "Vô địch tháng",
                    "description": "30 ngày liên tiếp không vượt budget",
                    "icon": "🔥",
                    "isUnlocked": false
                },
                {
                    "id": "ach_insight_seeker",
                    "type": "BEHAVIOR",
                    "title": "Tìm kiếm Insight",
                    "description": "Xem 5 insights khác nhau",
                    "icon": "📈",
                    "isUnlocked": false
                },
                {
                    "id": "ach_action_taker",
                    "type": "BEHAVIOR",
                    "title": "Người hành động",
                    "description": "Thực hiện 1 gợi ý từ hệ thống",
                    "icon": "📈",
                    "isUnlocked": false
                }
            ],
            "badges": [
                {
                    "id": "ach_first_budget",
                    "type": "MILESTONE",
                    "title": "Bước đầu tiên",
                    "description": "Tạo ngân sách đầu tiên",
                    "icon": "🏆",
                    "unlockedAt": "23:47:21 31/3/2026",
                    "isUnlocked": true
                },
                {
                    "id": "ach_goal_achiever",
                    "type": "MILESTONE",
                    "title": "Người đạt mục tiêu",
                    "description": "Hoàn thành 1 mục tiêu tài chính",
                    "icon": "🏆",
                    "unlockedAt": "23:47:21 31/3/2026",
                    "isUnlocked": true
                },
                {
                    "id": "ach_7day_streak",
                    "type": "STREAK",
                    "title": "Cháy tuần",
                    "description": "7 ngày liên tiếp không vượt budget",
                    "icon": "🔥",
                    "unlockedAt": "23:47:21 31/3/2026",
                    "isUnlocked": true
                }
            ]
        },
        "summary": {
            "totalBudget": "₫4.000.000",
            "totalSpent": "₫0",
            "buono": "₫4.000.000",
            "overallStatus": "HEALTHY",
            "statusMessage": "✅ Tình hình tài chính bình thường"
        }
    }
}
```

**Use case**: Load toàn bộ dashboard một lần

---

## 📊 Tính toán hiển thị (Multi-Currency)

### 1. Budget Metrics (Single Account/Currency)

```
📌: Account VND, Budget Food

💰 Giới hạn: 1,000,000 ₫
✅ Đã dùng: 300,000 ₫ (30%)
📛 Còn lại: 700,000 ₫

⚠️ Ngày còn lại: 5 ngày
💹 Tốc độ/ngày: 60,000 ₫/ngày
📈 Dự báo cuối tháng: 900,000 ₫ ← SAFE

Trạng thái: ON_TRACK ✅

---

💱 Multi-Currency Example:
Account USD, Budget Gas
💰 Limit: USD 500
✅ Spent: USD 150 (30%)
📛 Remaining: USD 350

Currency tự động từ account!
```

### 2. Goal Metrics (Single Account/Currency)

```
📌: Account VND, Goal Travel

🎯 Mục tiêu: 10,000,000 ₫ (Ngày 30/6/2026)
📊 Hiện tại: 3,500,000 ₫ (35%)
❌ Cần thêm: 6,500,000 ₫

📈 Tốc độ: 150,000 ₫/ngày
⏱️ Ngày còn lại: 97 ngày
🔮 Dự kiến hoàn thành: 10/5/2026 ← AHEAD 51 DAYS ✅

Trạng thái: AHEAD ✅

---

💱 Multi-Currency Example:
Account USD, Goal Study
🎯 Target: USD 50,000 (Ngày 31/12/2026)
📊 Current: USD 15,000 (30%)
❌ Needed: USD 35,000

📈 Velocity: USD 150/day
🔮 Est. completion: 25/11/2026
Trạng thái: ON_TRACK ✅
```

### 3. Key Rules

- **Single Account = Single Currency**: Không cần convert
- **Multi-Account = Multi-Currency**: Cần convert khi tổng hợp
- **Budget/Goal currency**: Tự động từ account (không thể sửa)
- **Allocate**: Check account balance (amount từ account currency)
- **Withdraw**: Check goal balance (amount từ goal currency)
- **Display**: Luôn hiện currency kèm amount (₫, $, €, etc.)

---

## 🔄 Workflows

### Workflow 1: Create Goal

```
USER: POST /personal/goals
{
  name: "Travel Fund",
  targetAmountCents: 100000,
  accountId: "acc-123-usd",  ← REQUIRED (or auto-primary)
}
                           ↓
SYSTEM: GoalsService.create()
  1. Load Account (acc-123-usd)
  2. Get currency from account → "USD"
  3. Create Goal with currency="USD", accountId="acc-123-usd"
  4. Save to database
                           ↓
RESPONSE:
{
  id: "goal-123",
  currency: "USD",           ← Tự động từ account
  accountId: "acc-123-usd",  ← Lưu trữ liên kết
  name: "Travel Fund"
}
```

### Workflow 2: Allocate to Goal (Check Account Balance)

```
USER: POST /personal/goals/goal-123/allocate
{ amountCents: 50000 }
                           ↓
SYSTEM: GoalsService.allocate()
  1. Load Goal (goal-123)
     → accountId="acc-123-usd", currency="USD"
  2. Load Account (acc-123-usd)
     → currentBalance=1000000 USD

  3. ⚠️ CHECK: account.balance >= 50000?
     → YES ✅ hoặc NO ❌ throw Error

  4. UPDATE Goal:
     currentAmount: 0 → 50000 USD
  5. UPDATE Account:
     currentBalance: 1000000 → 950000 USD
  6. Save both
                           ↓
RESPONSE:
{
  goalId: "goal-123",
  previousBalance: 0,
  newBalance: 50000,
  currency: "USD",           ← Display
  accountId: "acc-123-usd"
}
```

### Workflow 3: Withdraw from Goal (Check Goal Balance)

```
USER: POST /personal/goals/goal-123/withdraw
{ amountCents: 20000 }
                           ↓
SYSTEM: GoalsService.withdraw()
  1. Load Goal (goal-123)
     → accountId="acc-123-usd", currency="USD"
     → currentAmount=50000 USD

  2. ⚠️ CHECK: goal.currentAmount >= 20000?
     → YES ✅ hoặc NO ❌ throw Error
     → ❌ NOT account balance!

  3. UPDATE Goal:
     currentAmount: 50000 → 30000 USD
  4. UPDATE Account:
     currentBalance: 950000 → 970000 USD
  5. Save both
                           ↓
RESPONSE:
{
  goalId: "goal-123",
  previousBalance: 50000,
  newBalance: 30000,
  currency: "USD",           ← Display
  accountId: "acc-123-usd"
}
```

### Workflow 4: Analytics (Single Account - No Conversion)

```
USER: GET /personal/analytics/budgets?accountId=acc-123-usd
                           ↓
SYSTEM: BudgetAnalyticsService
  1. Filter: WHERE account_id = acc-123-usd
  2. Get all budgets for this account (all VND)
  3. Calculate totals (same currency, no conversion!)
     └─ totalBudget: 10M VND
     └─ totalSpent: 3M VND
     └─ totalRemaining: 7M VND
  4. Return without conversion
```

---

## 📋 Tóm tắt Endpoint (Multi-Currency Ready)

| Nhóm         | HTTP   | Endpoint                                      | Miêu tả                      | 💱 Multi-Currency    |
| ------------ | ------ | --------------------------------------------- | ---------------------------- | -------------------- |
| **BUDGET**   | GET    | `/personal/budgets`                           | Danh sách budgets            | ✅ Per-account       |
|              | GET    | `/personal/budgets/:id`                       | Chi tiết budget              | ✅ Auto from account |
|              | POST   | `/personal/budgets`                           | Tạo budget (+ accountId)     | ✅ Auto from account |
|              | PATCH  | `/personal/budgets/:id`                       | Cập nhật budget              | ✅ Currency fixed    |
|              | DELETE | `/personal/budgets/:id`                       | Xóa budget                   | N/A                  |
|              | GET    | `/personal/analytics/budgets`                 | Tổng hợp workspace           | ⚠️ Convert needed    |
|              | GET    | `/personal/analytics/budgets/:id/prediction`  | Dự báo vượt                  | ✅ Single currency   |
|              | GET    | `/personal/transactions/linked-to-budget/:id` | Chi tiêu của budget          | ✅ Single currency   |
| **GOAL**     | GET    | `/personal/goals`                             | Danh sách goals              | ✅ Per-account       |
|              | GET    | `/personal/goals/:id`                         | Chi tiết goal                | ✅ Auto from account |
|              | POST   | `/personal/goals`                             | Tạo goal (+ accountId)       | ✅ Auto from account |
|              | PATCH  | `/personal/goals/:id`                         | Cập nhật goal                | ✅ Currency fixed    |
|              | DELETE | `/personal/goals/:id`                         | Xóa goal                     | N/A                  |
|              | POST   | `/personal/goals/:id/allocate`                | Phân bổ tiền (check account) | ✅ Single currency   |
|              | POST   | `/personal/goals/:id/withdraw`                | Rút tiền (check goal)        | ✅ Single currency   |
|              | GET    | `/personal/transactions/linked-to-goal/:id`   | Lịch sử allocate/withdraw    | ✅ Single currency   |
| **INSIGHTS** | GET    | `/personal/analytics/dashboard`               | Toàn bộ dashboard            | ⚠️ Convert needed    |
|              | GET    | `/personal/analytics/goals`                   | Tóm tắt goals                | ⚠️ Convert needed    |
|              | GET    | `/personal/analytics/insights`                | Insights                     | ⚠️ Convert needed    |
|              | GET    | `/personal/analytics/anomalies`               | Bất thường                   | ⚠️ Convert needed    |
|              | GET    | `/personal/analytics/suggestions`             | Gợi ý                        | ⚠️ Convert needed    |
|              | GET    | `/personal/analytics/optimization`            | Tối ưu budget                | ⚠️ Convert needed    |
|              | GET    | `/personal/analytics/goal-strategy/:id`       | Chiến lược goal              | ✅ Single currency   |
|              | GET    | `/personal/analytics/gamification`            | Gamification stats           | ⚠️ Convert needed    |
|              | POST   | `/personal/analytics/budget-breakdown`        | Gợi ý chia ngân sách         | ⚠️ Convert needed    |
|              | GET    | `/personal/analytics/export`                  | Export data                  | ⚠️ All currencies    |

> ✅ = Không cần convert (single account/currency)  
> ⚠️ = Cần convert (multi-account/currency)

---

## 💱 Multi-Currency Architecture (NEW v2.0)

### Entity Relationships

```
Workspace (1:N) Account (1:N) Budget
                         (1:N) Goal
                         (1:N) ExchangeRate (N:N rate mapping)

- Workspace: Chứa multiple accounts & exchange rates
- Account: 1 currency (VND, USD, EUR, etc.)
- Budget: Liên kết 1 account → auto currency
- Goal: Liên kết 1 account → auto currency
- ExchangeRate: Per-workspace, all currency pairs
```

### Key Points

1. **accountId Required** (or auto-primary)
   - Frontend phải gửi accountId khi create budget/goal
   - Nếu không → hệ thống lấy account primary
   - Một budget/goal = 1 account = 1 currency

2. **Currency Auto-Inheritance**
   - Budget.currency = Account.currency (tự động)
   - Goal.currency = Account.currency (tự động)
   - Không cần truyền currency vào request

3. **Allocate vs Withdraw**
   - **Allocate**: Check account.balance (nguồn) ✅
   - **Withdraw**: Check goal.balance (nguồn) ✅
   - Khác nhau quan trọng!

4. **Analytics Conversion**
   - Single account: Không cần convert
   - Multi-account: Dùng ExchangeRateService convert to base currency (VND)
   - Response luôn chỉ ra currency + có converted amounts

### Response Format

```typescript
// Create Budget/Goal - LUÔN có currency + accountId
{
  id: "...",
  currency: "VND",              // ← Tự động từ account
  accountId: "acc-123-vnd",     // ← Liên kết account
  ... other fields
}

// Allocate/Withdraw - LUÔN có currency
{
  goalId: "...",
  currency: "VND",              // ← Cho display
  accountId: "acc-123-vnd",     // ← Nếu cần track
  transactionType: "GOAL_ALLOCATION",
  ... other fields
}

// Analytics - Convert to base currency
{
  summaryByBaseCurrency: {
    baseCurrency: "VND",        // ← Base (phục vụ dashboard)
    totalInBase: 100000000,     // ← Converted từ các currency khác
    breakdown: [
      { currency: "USD", amount: 50000 },
      { currency: "VND", amount: 50000000 }
    ]
  }
}
```

---

## ✅ Implemented Endpoints

### CRUD Endpoints (FULL Working ✅)

**Budget:**

- ✅ GET `/personal/budgets` - List all budgets
- ✅ GET `/personal/budgets/:id` - Get one budget
- ✅ POST `/personal/budgets` - Create budget (upsert logic)
- ✅ PATCH `/personal/budgets/:id` - Update budget
- ✅ DELETE `/personal/budgets/:id` - Soft delete budget

**Goal:**

- ✅ GET `/personal/goals` - List all goals
- ✅ GET `/personal/goals/:id` - Get one goal
- ✅ POST `/personal/goals` - Create goal
- ✅ PATCH `/personal/goals/:id` - Update goal
- ✅ DELETE `/personal/goals/:id` - Soft delete goal

**Goal Transactions:**

- ✅ POST `/personal/goals/:id/allocate` - Allocate to goal
- ✅ POST `/personal/goals/:id/withdraw` - Withdraw from goal
- ✅ GET `/personal/transactions/linked-to-goal/:id` - Transaction history

**Budget Transactions:**

- ✅ GET `/personal/transactions/linked-to-budget/:id` - Transaction history

### Analytics Endpoints (FULL Working ✅)

- ✅ GET `/personal/analytics/dashboard` - Full dashboard data
- ✅ GET `/personal/analytics/budgets` - Budget summary
- ✅ GET `/personal/analytics/budgets/:id/prediction` - Predict overflow
- ✅ GET `/personal/analytics/goals` - Goal summary
- ✅ GET `/personal/analytics/insights` - Insights
- ✅ GET `/personal/analytics/anomalies` - Anomalies detection
- ✅ GET `/personal/analytics/suggestions` - Smart suggestions
- ✅ GET `/personal/analytics/optimization` - Budget optimization
- ✅ GET `/personal/analytics/goal-strategy/:id` - Goal strategy
- ✅ GET `/personal/analytics/gamification` - Gamification stats
- ✅ POST `/personal/analytics/budget-breakdown` - Auto budget breakdown
- ✅ GET `/personal/analytics/export` - Export data

---

## ⚠️ In Development (Partial Implementation)

- ⚠️ Multi-account analytics conversion (framework ready, needs ExchangeRateService integration)
- ⚠️ Real-time anomaly detection (basic logic done, needs ML/ML)
- ⚠️ Gamification scoring system (structure ready, needs fine-tuning)

---

## ❌ Not Yet Implemented

- ❌ Budget-to-transaction auto-linking (framework ready)
- ❌ Recurring budget creation (entities ready, service needs work)
- ❌ Goal achievement notifications (framework ready)
- ❌ Advanced predictive analytics (requires historical data)

---

## 🚨 Common Usage Errors & Solutions

### Error 1: "accountId is required"

**Problem:**

```
POST /personal/budgets
{ categoryId, periodMonth, amountLimitCents }
❌ Missing accountId
```

**Solution:**

```
POST /personal/budgets
{
  categoryId,
  periodMonth,
  amountLimitCents,
  accountId: "acc-123-vnd"  ← ADD THIS
}
```

**Or let system use primary:**

```
POST /personal/budgets
{ categoryId, periodMonth, amountLimitCents }
✅ System AUTO-USES primary account
```

---

### Error 2: "Số dư tài khoản không đủ" (Allocate fails)

**Problem:**

```
POST /personal/goals/goal-123/allocate
{ amountCents: 1000000 }
❌ Account balance = 500000 (not enough)
```

**Solution:**

```
1. First allocate money to account (transfer from bank)
2. Then allocate to goal

OR

POST /personal/goals/goal-456/allocate
{ amountCents: 300000 }
✅ Account balance >= 300000 (success)
```

---

### Error 3: "Số dư mục tiêu không đủ" (Withdraw fails)

**Problem:**

```
POST /personal/goals/goal-123/withdraw
{ amountCents: 100000 }
❌ Goal balance = 50000 (not enough)
```

**Solution:**

```
POST /personal/goals/goal-123/withdraw
{ amountCents: 40000 }
✅ Goal balance >= 40000 (success)
```

---

### Error 4: "Cannot change currency"

**Problem:**

```
PATCH /personal/goals/goal-123
{ currency: "USD" }
❌ Currency is derived from account, cannot change
```

**Solution:**

```
❌ Cannot change goal currency
✅ Create new goal with different accountId (different currency)

OR

Transfer between accounts (future feature)
```

---

## 📞 Support & FAQ

**Q: Tôi tạo budget nhưng không thấy amountLimitCents trong response?**  
A: Kiểm tra response status. Nếu 201/200, hãy inspect response body - nó có trong đó.

**Q: Allocate và Withdraw khác nhau như thế nào?**  
A:

- **Allocate**: Kiểm tra **account balance** (nguồn tiền từ account)
- **Withdraw**: Kiểm tra **goal balance** (nguồn tiền từ goal)

**Q: Tôi có multiple account currencies (VND + USD), làm sao để tổng hợp?**  
A: Dùng analytics endpoint, nó tự convert sang base currency (VND).

**Q: Có cách nào để force currency khác cho budget?**  
A: Không, currency tự động từ account. Tạo account mới với currency khác nếu cần.
