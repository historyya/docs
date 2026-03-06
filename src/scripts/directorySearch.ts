export const normalizeQuery = (value: string): string =>
  value.trim().toLocaleLowerCase("en-US");

const escapeHtml = (text: string): string =>
  text.replace(
    /[&<>"]/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char] ?? char,
  );

export const highlightMatch = (text: string, query: string): string => {
  if (!query) return escapeHtml(text);

  const lower = text.toLocaleLowerCase("en-US");
  const q = query.toLocaleLowerCase("en-US");
  let result = "";
  let i = 0;

  while (i < text.length) {
    const idx = lower.indexOf(q, i);
    if (idx === -1) {
      result += escapeHtml(text.slice(i));
      break;
    }
    result += escapeHtml(text.slice(i, idx));
    result += `<mark class="highlight">${escapeHtml(text.slice(idx, idx + q.length))}</mark>`;
    i = idx + q.length;
  }

  return result;
};

export const updateQueryString = (
  params: URLSearchParams,
  key: string,
  value: string,
): string => {
  if (value) {
    params.set(key, value);
  } else {
    params.delete(key);
  }
  return params.toString();
};

export const bindSearchShortcuts = (
  input: HTMLInputElement,
  onReset: () => void,
): void => {
  input.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    input.value = "";
    onReset();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey)
      return;

    const target = event.target;
    if (
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement
    )
      return;

    event.preventDefault();
    input.focus();
    input.select();
  });
};
