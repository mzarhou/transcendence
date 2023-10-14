export function isMessageVisible(
  messageEl: Element,
  rootEl: Element,
  options?: {
    scaleRootBottom?: number;
    scaleRootTop?: number;
  }
) {
  const newMessageRec = messageEl.getBoundingClientRect();
  const rootRec = rootEl.getBoundingClientRect();
  return (
    newMessageRec.bottom <= rootRec.bottom + (options?.scaleRootBottom ?? 0) &&
    newMessageRec.top >= rootRec.top - (options?.scaleRootTop ?? 0)
  );
}
