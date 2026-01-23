import * as Y from "yjs";

const doc = new Map<string, Y.Doc>();

export function getYdoc(roomId: string) {
  if (!doc.has(roomId)) {
    doc.set(roomId, new Y.Doc());
  }
  return doc.get(roomId);
}
