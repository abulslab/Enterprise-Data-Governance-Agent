/**
 * Federal Reserve ABA Routing Transit Number Checksum Validator
 * Verifies 9-digit US banking routing numbers mathematically:
 * (3*(d1 + d4 + d7) + 7*(d2 + d5 + d8) + 1*(d3 + d6 + d9)) mod 10 == 0
 */
export function isValidAbaRouting(routing: string): boolean {
  const sanitized = routing.replace(/\D/g, '');
  if (sanitized.length !== 9) return false;

  const d = sanitized.split('').map(c => parseInt(c, 10));
  const checksum = (
    3 * (d[0] + d[3] + d[6]) +
    7 * (d[1] + d[4] + d[7]) +
    1 * (d[2] + d[5] + d[8])
  ) % 10;

  return checksum === 0;
}
