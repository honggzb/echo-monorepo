import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@workspace/ui/components/resizable";
import ConversationsPanel from "../components/conversations-panel";

const ConversationsLayout = ({ children }: { children: React.ReactNode}) => {
  return (
    <ResizablePanelGroup orientation="horizontal" className="h-full flex-1">
      <ResizablePanel defaultSize={200} maxSize={400} minSize={150}>
        <ConversationsPanel />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel className="h-full">
        {children}
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

export default ConversationsLayout