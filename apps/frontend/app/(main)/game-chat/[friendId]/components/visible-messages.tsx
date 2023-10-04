import { useAtom } from "jotai";
import { atom } from "jotai";

const visibleMessagesAtom = atom<Set<number>>(new Set([]));

const useVisbleMessages = () => {
  const [visibleMessages] = useAtom(visibleMessagesAtom);
  return Array.from(visibleMessages).sort((a, b) => a - b);
};

const useRemoveVisibleMessage = () => {
  const [, setVisibleMessages] = useAtom(visibleMessagesAtom);
  return (messageId: number) => {
    setVisibleMessages((msgs) => {
      msgs.delete(messageId);
      return new Set(msgs);
    });
  };
};

const useAddVisibleMessage = () => {
  const [, setVisibleMessages] = useAtom(visibleMessagesAtom);
  return (messageId: number) => {
    setVisibleMessages((msgs) => {
      return new Set(msgs.add(messageId));
    });
  };
};

function VisibleMessages() {
  const visibleMessages = useVisbleMessages();

  return (
    <div className="top-0 flex w-full space-x-4 overscroll-x-auto bg-red-500">
      <div className="text-white">{"->"}</div>
      {visibleMessages.map((id) => (
        <div key={id} className="text-white">
          {id}
        </div>
      ))}
    </div>
  );
}

export {
  VisibleMessages,
  visibleMessagesAtom,
  useAddVisibleMessage,
  useRemoveVisibleMessage,
};
