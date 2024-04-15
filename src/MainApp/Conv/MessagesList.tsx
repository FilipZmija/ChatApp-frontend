import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { ISingleMessage } from "../../types/messages";
import Message from "./Message";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import LandingInfo from "./LandingInfo";
import "./ConvStyle/MessagesList.css";
import { TUser } from "../../types/user";
import { TRoom } from "../../types/room";
import axios from "axios";
import {
  loadMoreMessages,
  readMessages,
} from "../../redux/slices/conversationSlice";
import { readLastMessage } from "../../redux/slices/instancesSlice";

const renderStyles = (
  messages: { userId: number; createdAt: string }[],
  index: number
) => {
  const timeDifference =
    index !== 0
      ? new Date(messages[index].createdAt).getTime() -
        new Date(messages[index - 1]?.createdAt).getTime()
      : 2000000;

  const timeDifferenceForward = messages[index + 1]
    ? new Date(messages[index + 1].createdAt).getTime() -
      new Date(messages[index]?.createdAt).getTime()
    : 2000000;

  if (
    messages[index]?.userId !== messages[index - 1]?.userId ||
    timeDifference > 600000
  ) {
    if (
      messages[index].userId === messages[index + 1]?.userId &&
      timeDifferenceForward < 600000
    )
      return "first";
    else return "single";
  } else if (messages[index]?.userId !== messages[index + 1]?.userId) {
    return "last"; // Apply styles for the last element
  }
  if (timeDifferenceForward > 600000) return "last";
  return "middle"; // Return empty object if neither first nor last element
};

const messageIndicators = (amount: number, id: number) => {
  const messages: ISingleMessage[] = [];

  for (let i = 0; i < amount; i++) {
    messages.push({
      id: i,
      userId: Math.random() > 0.5 ? id : 0,
      content: "",
      status: "sent",
      user: { name: "", type: "user", id: 0 },
      createdAt: new Date().getTime().toString(),
      type: "message",
    });
  }
  return messages;
};

export default function MessagesList({
  messages,
  id,
  recipient,
  conversationId,
}: {
  messages: ISingleMessage[] | undefined;
  id: number;
  recipient: TUser | TRoom;
  conversationId: number;
}) {
  const dispatch = useAppDispatch();
  const [page, setPage] = useState<number>(2);
  const [isActive, setIsActive] = useState<boolean>(true);
  const { id: myId } = useAppSelector((state) => state.auth);
  const { loading } = useAppSelector((state) => state.conv);
  const { token } = useAppSelector((state) => state.auth);
  const [loadingNewMessages, setLoadingNewMessages] = useState<boolean>(false);
  const [shouldScrollToBottom, setShouldScrollToBottom] =
    useState<boolean>(true);
  const messagesListRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastMessageId = messages?.at(-1)?.id;
  const [distanceTop, setDistanceTop] = useState(0);
  const [noMoreData, setNoMoreData] = useState(false);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    document.addEventListener("visibilitychange", () =>
      setIsActive(!document.hidden)
    );
    return () => {
      document.removeEventListener("visibilitychange", () => {
        setIsActive(!document.hidden);
      });
    };
  }, []);

  useEffect(() => {
    if (isActive && lastMessageId && conversationId) {
      dispatch(readMessages({ conversationId, messageId: lastMessageId }));
      dispatch(readLastMessage(conversationId));
    }
  }, [isActive, lastMessageId, conversationId, dispatch]);

  const getMessages = useCallback(async () => {
    try {
      setLoadingNewMessages(true);
      const params = new URLSearchParams();
      params.append("page", page.toString());

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/messages/${conversationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params,
        }
      );
      if (response.data.messages.length === 0) {
        setNoMoreData(true);
      } else {
        dispatch(loadMoreMessages(response.data.messages));
        setPage(page + 1);
      }
      setLoadingNewMessages(false);
    } catch (e) {
      console.log(e);
    }
  }, [page, conversationId, token, dispatch]);

  const scrollListenerTop = useCallback(async () => {
    if (messagesListRef.current) {
      let top = messagesListRef.current.scrollTop;
      if (!distanceTop) {
        setDistanceTop(Math.round(messagesListRef.current.clientHeight * 0.1));
      }
      if (top < distanceTop && !loadingNewMessages && !noMoreData) {
        const prevScrollHeight = messagesListRef.current.scrollHeight;
        await getMessages();
        const newScrollHeight = messagesListRef.current.scrollHeight;
        const scrollHeightDifference = newScrollHeight - prevScrollHeight;
        messagesListRef.current.scrollTop += scrollHeightDifference;
      }
    }
  }, [distanceTop, loadingNewMessages, getMessages, noMoreData]);

  useLayoutEffect(() => {
    if (messages) {
      const tableRef = messagesListRef.current;
      if (tableRef) {
        tableRef.addEventListener("scroll", scrollListenerTop);
        return () => {
          tableRef.removeEventListener("scroll", scrollListenerTop);
        };
      }
    }
  }, [messages, scrollListenerTop]);

  useLayoutEffect(() => {
    messagesEndRef.current?.scrollIntoView();
  }, [id]);

  useLayoutEffect(() => {
    if (shouldScrollToBottom) scrollToBottom();
  }, [messages, shouldScrollToBottom]);

  const handleScroll = async () => {
    if (
      messagesListRef.current &&
      messagesEndRef.current &&
      messagesEndRef.current.getBoundingClientRect().bottom <=
        messagesListRef.current.getBoundingClientRect().bottom
    ) {
      setShouldScrollToBottom(true);
    } else {
      setShouldScrollToBottom(false);
    }
  };

  return (
    <>
      {id !== 0 ? (
        <div className="messages-list-container">
          {messages && messages.length > 0 ? (
            <div
              className="messages-list"
              onScroll={handleScroll}
              ref={messagesListRef}
            >
              {messages?.map((_, index) => {
                if (index + 1 < messages.length)
                  return (
                    <Message
                      message={messages[index]}
                      type={renderStyles(messages, index)}
                      messageSender={
                        messages[index].userId === myId ? "me" : recipient.name
                      }
                      nextMessageSender={
                        messages[index + 1].userId === myId
                          ? "me"
                          : recipient.name
                      }
                      timeDifferenceBack={
                        index !== 0
                          ? new Date(messages[index].createdAt).getTime() -
                            new Date(messages[index - 1]?.createdAt).getTime()
                          : 2000000
                      }
                    />
                  );
                else {
                  return (
                    <Message
                      message={messages[index]}
                      type={renderStyles(messages, index)}
                      messageSender={
                        messages[index].userId === myId ? "me" : recipient.name
                      }
                      nextMessageSender={null}
                      timeDifferenceBack={
                        index !== 0
                          ? new Date(messages[index].createdAt).getTime() -
                            new Date(messages[index - 1]?.createdAt).getTime()
                          : 2000000
                      }
                    />
                  );
                }
              })}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <>
              {loading && myId ? (
                messageIndicators(21, myId).map((item, index, messages) => {
                  return (
                    <Message
                      message={messages[index]}
                      type={renderStyles(messages, index)}
                      messageSender={
                        messages[index].userId === myId ? "me" : "guest"
                      }
                      nextMessageSender={
                        messages[index].userId === myId ? "me" : "guest"
                      }
                      timeDifferenceBack={0}
                    />
                  );
                })
              ) : (
                <div className="messages-landing">
                  <p>Send your first message!</p>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <LandingInfo />
      )}
    </>
  );
}
