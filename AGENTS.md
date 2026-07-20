# Agent Instructions

Before starting a new chat/session, fetch document id `2c0ad555-4f3c-4140-80eb-fa6569c6a3d4` from the `Belov Personal Notes` tool.

Do not fetch these instructions on every request. Fetch them only when starting with an empty chat/context.

The remote document is the source of truth.

The local `AGENTS.md` file must contain only this header. Do not store any agent instructions locally below this header. All actual instructions must be fetched from the remote document and kept remotely only.
