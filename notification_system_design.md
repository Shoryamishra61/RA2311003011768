# Stage 1: Priority Inbox Notification System Design

## Overview
The goal of the Priority Inbox is to display the top 'n' most important unread notifications to the users, alleviating the issue of losing track of critical updates due to high notification volume. Priority is determined by a combination of a notification's weight (Placement > Result > Event) and its recency.

## Priority Logic
Notifications are assigned an integer weight based on their type:
- **Placement**: Weight 3 (Highest Priority)
- **Result**: Weight 2
- **Event**: Weight 1 (Lowest Priority)

When determining the top notifications, we use a custom comparator that sorts:
1. **By Weight (Descending)**: Higher weight notifications always appear before lower weight ones.
2. **By Recency (Descending)**: If two notifications have the same weight, the more recent one (based on the `Timestamp` field) is prioritized.

## Algorithm for Efficiently Maintaining Top 10 Notifications
To maintain the top `n` (e.g., 10) notifications efficiently as new notifications stream in, we use a **Min-Heap (Priority Queue)** of size `n`, or a bounded sorted array since `n` is typically very small.

**Approach using a Bounded Sorted Array (for small 'n'):**
1. We maintain a sorted array of the top `n` notifications.
2. When a new notification arrives:
   - We compare it with the lowest priority notification currently in our top `n` list (which is the last element of our sorted array).
   - If the new notification has a higher priority (greater weight or same weight but more recent), we insert it into the array in its correct sorted position and evict the lowest priority element, keeping the array size strictly bounded to `n`.
3. **Time Complexity**: For each incoming notification, determining if it belongs in the top `n` takes O(1) time. Inserting it takes O(n) time. Since `n` is small (e.g., 10 or 20), this is practically O(1) and extremely efficient, avoiding the need to re-sort the entire database.
4. **Space Complexity**: O(n) auxiliary space to store the top `n` elements.

This ensures real-time updates and low latency, making it highly scalable for a high volume of incoming notifications.
