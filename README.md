# 🔗 Bitespeed Identity Reconciler

A robust backend service built with **Next.js** and **Prisma 7** that reconciles multiple customer contact points into a single "Identity" profile. This service was designed to solve the identity linkage problem where a single user may interact with a platform using different email and phone combinations.

## 🚀 The Mission
The goal is to consolidate disparate contact records into a unified response. If a user provides an email or phone number that matches an existing record, the system links them. It also handles the "Bridge" case, where two previously separate primary accounts are linked by a new piece of information and must be merged.

## 🛠️ Tech Stack
* **Framework:** [Next.js 15+](https://nextjs.org/) (App Router)
* **Database:** PostgreSQL (Hosted on Neon/Supabase)
* **ORM:** [Prisma 7](https://www.prisma.io/docs/orm/reference/prisma-7-migration-guide)
* **Driver:** Node-Postgres (`pg`) with Driver Adapters
* **Language:** TypeScript
* **Runner:** `tsx` for modern ESM execution

---

## 🏗️ Architecture & Features

### **Identity Reconciliation Algorithm**
1.  **Search:** Queries the database for any existing contacts matching the provided email or phone number.
2.  **Creation:** If no match exists, a new `primary` contact is created.
3.  **Linkage:** If matches are found, the system identifies the oldest `primary` contact as the "Root."
4.  **The Merge (Bridge Case):** If a request overlaps with two different primary clusters, the newer cluster is converted to `secondary` and linked to the older root.
5.  **Consolidation:** Returns a clean JSON response containing unique emails, phone numbers, and secondary IDs.

### **Prisma 7 Implementation**
This project utilizes the latest **Prisma 7** features, including:
* **Configuration Decoupling:** Connection URLs moved from `schema.prisma` to `prisma.config.ts`.
* **Rust-free Driver Adapters:** Using `@prisma/adapter-pg` for improved performance and edge compatibility.
* **Custom Output:** Client generation redirected to `src/generated/prisma` for better project organization.

---

## 🚦 Getting Started

### 1. Environment Setup
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://user:password@host:port/dbname?sslmode=require"