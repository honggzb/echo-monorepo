import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { atomFamily } from 'jotai-family'
import { WidgetScreen } from "../../types";
import { CONTACT_SESSION_KEY } from "../../constants";
import { Doc, Id } from "@workspace/backend/_generated/dataModel";

// basic widget state atoms
export const screenAtom = atom<WidgetScreen>("loading");
export const organizationIdAtom = atom<string | null>(null);
// organization-scoped contact session atoms
export const contactSessionIdAtomFamily = atomFamily((organizationId: string) => {
  // save organizationId to localStorage with a key that includes the organization ID to support multiple organizations on the same domain
  return atomWithStorage(`${CONTACT_SESSION_KEY}_${organizationId}`, organizationId);
});
export const errorMessageAtom = atom<string | null>(null);
export const loadingMessageAtom = atom<string | null>(null);
export const conversationIdAtom = atom<Id<"conversations"> | null>(null);

//export const widgetSettingsAtom = atom<Doc<"widgetSettings"> | null>(null);
// export const vapiSecretsAtom = atom<{
//   publicApiKey: string;
// } | null>(null);
// export const hasVapiSecretsAtom = atom((get) => get(vapiSecretsAtom) !== null);