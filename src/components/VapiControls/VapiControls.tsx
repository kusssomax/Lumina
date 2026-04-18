"use client";
import { Card, CardContent } from "@/components/ui/card";
import { useVapi } from "@/hooks/useVapi";
import { Mic, MicOff } from "lucide-react";
import { IBook } from "@/types";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ChatConversation from "./ChatConversation";



const VapiControls = ({ book }: { book: IBook }) => {
    const {
        status,
        isActive,
        messages,
        currentMessage,
        currentUserMessage,
        duration,
        startSession,
        stopSession,
        clearError,
    } = useVapi(book);

    const isAiActive = status === 'thinking' || status === 'speaking';

    return (
        <>
        {/* Header card */}
         <Card className="px-6 py-6">
        <CardContent className="p-0 flex flex-row gap-6 items-start">
          <div className="relative shrink-0">
            <Image
              src={book.coverURL}
              alt={book.title}
              width={120}
              height={160}
              className="rounded-lg shadow-md object-cover"
            />
            <div className="absolute -bottom-3 -right-3">
              {isAiActive && (
                <span className="absolute inset-0 rounded-full animate-ping bg-primary/40" />
              )}
              <Button
                variant="outline"
                size="icon"
                onClick={isActive ? stopSession : startSession}
                className="relative size-15 rounded-full shadow-md [&_svg:not([class*='size-'])]:size-6"
                aria-label="Toggle microphone"
              >
                {isActive ? <Mic /> : <MicOff />}
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-1">
            <div>
              <h1 className="font-serif text-2xl font-bold leading-snug sm:text-3xl">
                {book.title}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">by {book.author}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge>
                <span className="size-2 rounded-full bg-gray-400" />
                Ready
              </Badge>
              <Badge>Voice: {book.persona ?? "Default"}</Badge>
              <Badge>0:00 / 15:00</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

        <Card className="min-h-100">
            <CardContent className="p-0">
                <ChatConversation
                    messages={messages}
                    currentMessage={currentMessage}
                    currentUserMessage={currentUserMessage}
                />
            </CardContent>
        </Card>
        </>
    )
}

export default VapiControls