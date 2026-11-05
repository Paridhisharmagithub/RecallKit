export async function requestStudySet(notes, signal) {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ notes }),
    signal,
  });

  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new Error('The server returned an unreadable response. Please try again.');
  }

  if (!response.ok) {
    throw new Error(payload?.error?.message || `Request failed (${response.status}). Please try again.`);
  }

  return payload?.data;
}
