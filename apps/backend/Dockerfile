FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json ./apps/backend/package.json
COPY packages/shared-types/package.json ./packages/shared-types/package.json

RUN pnpm install --frozen-lockfile

COPY apps/backend ./apps/backend
COPY packages/shared-types ./packages/shared-types

WORKDIR /app/apps/backend

RUN pnpm build

EXPOSE 3001

CMD ["node", "dist/index.js"]
