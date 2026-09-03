import { eq, and, or } from "drizzle-orm";
import { db } from "../../config/db.js";
import { connections, users } from "../../db/schema/index.js";
import { ApiError } from "../../lib/api-error.js";
import { getFullProfile } from "../users/users.service.js";

/**
 * Send a connection request to another user.
 */
export async function sendConnectionRequest(senderId: string, receiverId: string) {
  if (senderId === receiverId) {
    throw ApiError.badRequest("You cannot send a connection request to yourself");
  }

  // Verify receiver exists
  const [receiver] = await db
    .select()
    .from(users)
    .where(eq(users.id, receiverId))
    .limit(1);

  if (!receiver) {
    throw ApiError.notFound("Target student user not found");
  }

  // Check if connection already exists in any state
  const [existing] = await db
    .select()
    .from(connections)
    .where(
      or(
        and(eq(connections.senderId, senderId), eq(connections.receiverId, receiverId)),
        and(eq(connections.senderId, receiverId), eq(connections.receiverId, senderId))
      )
    )
    .limit(1);

  if (existing) {
    if (existing.status === "pending") {
      throw ApiError.badRequest("Connection request is already pending");
    }
    if (existing.status === "accepted") {
      throw ApiError.badRequest("You are already connected with this student");
    }
    if (existing.status === "rejected") {
      // Re-send request after rejection
      const [updated] = await db
        .update(connections)
        .set({
          senderId,
          receiverId,
          status: "pending",
          updatedAt: new Date(),
        })
        .where(eq(connections.id, existing.id))
        .returning();
      return updated;
    }
  }

  const [newConn] = await db
    .insert(connections)
    .values({
      senderId,
      receiverId,
      status: "pending",
    })
    .returning();

  return newConn;
}

/**
 * List connections for the current user categorized into pendingReceived, pendingSent, and accepted.
 */
export async function listUserConnections(userId: string) {
  const allConnRows = await db
    .select()
    .from(connections)
    .where(
      or(eq(connections.senderId, userId), eq(connections.receiverId, userId))
    );

  const pendingReceived = [];
  const pendingSent = [];
  const accepted = [];

  for (const conn of allConnRows) {
    if (conn.status === "pending") {
      if (conn.receiverId === userId) {
        const senderProfile = await getFullProfile(conn.senderId);
        pendingReceived.push({ connectionId: conn.id, profile: senderProfile, createdAt: conn.createdAt });
      } else {
        const receiverProfile = await getFullProfile(conn.receiverId);
        pendingSent.push({ connectionId: conn.id, profile: receiverProfile, createdAt: conn.createdAt });
      }
    } else if (conn.status === "accepted") {
      const otherUserId = conn.senderId === userId ? conn.receiverId : conn.senderId;
      const otherProfile = await getFullProfile(otherUserId);
      accepted.push({ connectionId: conn.id, profile: otherProfile, connectedAt: conn.updatedAt });
    }
  }

  return {
    pendingReceived,
    pendingSent,
    accepted,
  };
}

/**
 * Update connection status (accept or reject).
 */
export async function updateConnectionStatus(
  userId: string,
  connectionId: number,
  status: "accepted" | "rejected"
) {
  const [conn] = await db
    .select()
    .from(connections)
    .where(eq(connections.id, connectionId))
    .limit(1);

  if (!conn) {
    throw ApiError.notFound("Connection request not found");
  }

  if (conn.receiverId !== userId) {
    throw ApiError.forbidden("Only the request recipient can accept or reject connection requests");
  }

  const [updated] = await db
    .update(connections)
    .set({
      status,
      updatedAt: new Date(),
    })
    .where(eq(connections.id, connectionId))
    .returning();

  return updated;
}
