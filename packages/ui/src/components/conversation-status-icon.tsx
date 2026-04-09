import { CheckIcon, ArrowRightIcon, ArrowUpIcon } from "lucide-react";
import { Hint } from "./hint";
import { Button } from "./button";
import { Doc } from "@workspace/backend/convex/_generated/dataModel";

const ConversationStatusIcon = ({
  status,
  onClick,
}: {
  status: Doc<"conversations">["status"];
  onClick?: () => void;
}) => {

  if(status === "resolved") {
    return (
      <Hint text="Mark as unresolved">
        <Button onClick={onClick} size="sm" variant="tertiary">
          <CheckIcon />Escalated
        </Button>
      </Hint>
    )
  }

  if(status === "escalated") {
    return (
      <Hint text="Mark as resolved">
        <Button onClick={onClick} size="sm" variant="warning">
          <ArrowUpIcon />Unresolved
        </Button>
      </Hint>
    )
  }


  return (
    <Hint text="Mark as escalated">
        <Button onClick={onClick} size="sm" variant="ghost">
          <ArrowRightIcon />
        </Button>
    </Hint>
  )
}

export default ConversationStatusIcon