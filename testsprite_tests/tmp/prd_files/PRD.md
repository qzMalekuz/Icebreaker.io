# Icebreaker.io — Product Requirements Document

## What it is
Icebreaker.io is a real-time anonymous stranger matching web app.
Two users enter a username, get paired, receive a shared prompt,
and alternate sending 3 messages each (6 total). After all messages,
each user privately chooses Stay Connected or Vanish. If both choose
Stay they get a shared link. If either chooses Vanish, the session
disappears with no trace.

## Tech Stack
- Frontend: React + TypeScript, Vite, Socket.io-client
- Backend: Express + TypeScript, Socket.io
- No auth, no database, in-memory session state

## REST Endpoints
- GET /health → { status: "ok" }
- GET /api/stats → { onlineCount, activeSessions }
- GET /api/prompts → array of prompt strings

## Core User Flows
1. User enters username → clicks Match Me → enters waiting room
2. Two users get paired → both receive same prompt
3. Turn-based messaging: 3 messages each, server enforces turn order
4. After 6th message → both see Decision screen
5. Each user chooses Stay or Vanish privately
6. If both Stay → shareLink generated, shown to both
7. If either Vanishes → clean goodbye, no data shared

## Business Rules
- Max message length: 280 characters
- Wrong-turn messages rejected by server
- Decision timeout: 60 seconds, auto-vanish if no choice
- Disconnect mid-session: other user notified, session ends
- Sessions deleted from memory 5 minutes after completion
- No accounts, no logs, no stored messages