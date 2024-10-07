export function getStoredInt(key: string) {
  const value = localStorage.getItem(key) || ""
  return isNaN(parseInt(value)) ? 0 : parseInt(value);
}
