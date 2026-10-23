"use client";

import { createContext, useContext } from "react";
import type { Language } from "@/domain/settings";
import { messages, type Messages } from "./messages";

const MessagesContext = createContext<Messages>(messages.fr);

export function MessagesProvider({ language, children }: { language: Language; children: React.ReactNode }) {
  return <MessagesContext value={messages[language]}>{children}</MessagesContext>;
}

/** The strings for the current language. */
export const useMessages = () => useContext(MessagesContext);
