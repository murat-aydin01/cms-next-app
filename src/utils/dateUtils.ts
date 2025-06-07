const SESSION_EXPIRY_HOURS = 24;

export function createExpiresAt() {
  return new Date(Date.now() + SESSION_EXPIRY_HOURS * 1000 * 60 * 60);
}

export function checkIfExpired(dateForCheck: string | Date) {
  const expires = new Date(dateForCheck);
  if (isNaN(expires.getTime())) {
    throw new Error("Invalid date");
  }
  const now = new Date();
  return expires < now;
}
