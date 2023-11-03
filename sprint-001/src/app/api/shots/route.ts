
// Next.js Edge API Route Handlers: https://nextjs.org/docs/app/building-your-application/routing/router-handlers#edge-and-nodejs-runtimes
import { PocketBaseInit } from '@/lib/db/pocketbaseinit'
import { NextResponse, type NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const pb = await PocketBaseInit()

  const records = await pb.collection('shots').getFullList({
    sort: '-created',
    expand: 'possibleNarrations.requirements.requirementItems, possibleDecisions.requirements.requirementItems'
  });

  // const data = await records.json()

  return NextResponse.json(records)
}
