import SearchInput from "./components/search-input";
import SearchFriendItem from "./components/search-friend-item";

export default function ChatSearchPage() {
  return (
    <div className="flex h-0 w-full flex-grow flex-col space-y-8 px-1 pt-8 md:p-4 md:px-6 md:pt-0">
      <SearchInput />
      <div className="h-full space-y-4 overflow-y-auto pr-2">
        {Array(100)
          .fill(null)
          .map((_, index) => (
            <SearchFriendItem id={index + 1} />
          ))}
      </div>
    </div>
  );
}
