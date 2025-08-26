import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// Mock user database
const mockUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    password: "password123",
    createdAt: "2024-01-01T00:00:00Z",
  },
]

export async function GET() {
  try {
    const cookieStore = cookies()
    const sessionToken = cookieStore.get("session")

    if (!sessionToken) {
      return NextResponse.json({ message: "No session found" }, { status: 401 })
    }

    // Extract user ID from session token - in a real app, verify JWT or session
    const userId = sessionToken.value.split("_")[1]
    const user = mockUsers.find((u) => u.id === userId)

    if (!user) {
      return NextResponse.json({ message: "Invalid session" }, { status: 401 })
    }

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({ user: userWithoutPassword })
  } catch (error) {
    console.error("[v0] Auth check error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
