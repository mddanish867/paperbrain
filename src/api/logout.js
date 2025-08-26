import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  try {
    // Clear the session cookie
    const cookieStore = cookies()
    cookieStore.delete("session")

    return NextResponse.json({ message: "Logout successful" })
  } catch (error) {
    console.error("[v0] Logout error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
