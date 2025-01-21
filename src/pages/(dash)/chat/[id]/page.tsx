
// app/(dash)/chat/ChatViewPage.tsx

import { Suspense, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';    
import { alertCount$ } from '@/providers/event.service';
import { viewChat, getMessages, getNewMessages, postChatMessage, markRead } from '@/providers/logged-in/chat.service';
import { Chat } from '@/models/chat';
import { ChatMessage } from '@/models/chat-message';
import { useTranslation } from 'react-i18next';
import { page, track } from '@/providers/analytics.service';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ChatMessageComponent } from '@/components/app/chat-message';
import { alertDialog } from '@/hooks/use-alert-dialog';
import { errorMessage } from '@/utils/common';
import Loading from '../loading';
import DashLayout from '../../layout';


const ChatViewPage = () => {
    const { id } = useParams() as { id: string };

    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(false);
    const [sendingMessage, setSendingMessage] = useState(false);
    const [txtMessage, setTxtMessage] = useState('');
    const [loadingMoreMessages, setLoadingMoreMessages] = useState(false);
    const [haveUnreadMessage, setHaveUnreadMessage] = useState(false);
    const [messageGroups, setMessageGroups] = useState([]);
    const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
    const [prevScrollTop, setPrevScrollTop] = useState(0);
    const [completed, setCompleted] = useState(false);
    const [checkingNewMessages, setCheckingNewMessages] = useState(false);

    const contentRef = useRef(null);
    const panelRef = useRef(null);
    const { t } = useTranslation();

    /*const messageSubscription = interval(5 * 1000).subscribe(() => {
        checkNewMessages();
    });*/

    useEffect(() => {

        const btnChat = document.getElementById('btn-chat');
        if (btnChat) {
            btnChat.classList.add('hidden');
        }

        loadChat();
        loadMessages(true);
        markReadClicked();//on view enter

        /*this.content.getScrollElement().then(ele => {
            this.scrollPosition = ele.scrollTop;
          });

        const subscription = alertUpdate$.subscribe((res) => {
            console.log(res);
            //checkNewMessages();
        });*/

        alertCount$.subscribe((data: any) => {
            if (data.total > 0) {
                checkNewMessages();
            }
        });

        page('Chat Page');

        /*const messageSubscription = setInterval(() => {
            console.log("interval ", messages);
            checkNewMessages();
        }, 5 * 1000); // no need to scroll every time
        */

        //alertUpdate$.next({});

        return () => {
            track('page_exit', { page: 'Chat Page' });
          //  subscription.unsubscribe();

            //clearInterval(messageSubscription);
            //messageSubscription.unsubscribe();
            
            if (btnChat) {
                btnChat.classList.remove('hidden');
            }
        };
    }, []);

    const loadChat = async () => {
        const response = await viewChat(id);
        setChat(response);
    };


  /**
   * Check new message
   */
  async function checkNewMessage(scroll = false) {

    if (loading || loadingMoreMessages || checkingNewMessages) {
        console.log("already loading")
      return false;
    }

    let latest_message_index;

    if (messages.length > 0)
      latest_message_index = messages[messages.length - 1].message_index;

    getNewMessages(id, latest_message_index).then(newMessages => {

      /*this.content.getScrollElement().then(ele => {  
          
          //if scrolled to top 

          if(ele.scrollTop - ele.scrollHeight > 570) {

          }
      });*/

      if (newMessages.length == 0)
        return;

      for (let message of messages) {
        if (message.chat_message_uuid == newMessages[0].chat_message_uuid) {
          return false;//duplicate message fetched 
        }
      }

      const result = newMessages.reverse().concat(messages).sort((a: ChatMessage, b: ChatMessage) => {
        return a.message_index - b.message_index;
      });
      //[...newMessages.reverse(), ...messages];
 
        setMessages(result);
        processMessageList(result);
    
      // if it was at bottom or new message sent, then move to bottom and mark as read

      if (isScrolledToBottom || scroll) {
        markReadClicked();
        scrollToBottom();

        //if latest messages from agent(s)

      } else if (newMessages.length > 0 && newMessages[0]['message_sender_type'] == 1) {
        setHaveUnreadMessage(true);// show alert for new message
      }
    });
  }

    function onScroll(e: any) {
        //on top 100px and scrolling to top
    
        if (contentRef.current) {
            const ele = contentRef.current as HTMLElement;
             
            const currentScrollTop = ele.scrollTop;
            const isScrolledUp = currentScrollTop < prevScrollTop;
         
            setPrevScrollTop(currentScrollTop);

            if (isScrolledUp && currentScrollTop < 100) {
                doInfiniteMessages();
            }

            setIsScrolledToBottom((ele.scrollTop == ele.scrollHeight - ele.clientHeight));
        }
  
        setHaveUnreadMessage(false);
      }

    async function doInfiniteMessages() {

        if (completed) {
          return false;
        }
    
        if (loading || loadingMoreMessages || checkingNewMessages)
          return false;
    
        setLoadingMoreMessages(true);
    
        let last_message_index;
    
        if (messages.length > 0) {
          last_message_index = messages[0].message_index;
        } else {
          return false; //doInfiniteMessages will be called only to load older messages 
        }
    
        let originalHeight: number;
        if (contentRef.current) {
            const a = contentRef.current as HTMLElement;
            originalHeight = a.clientHeight;
        }

        getMessages(id, 1, last_message_index).then(respose => {
    
            setLoadingMoreMessages(false);
          
            const newMessages = respose.data;

            const result = newMessages.reverse().concat(messages).sort((a: ChatMessage, b: ChatMessage) => {
                return a.message_index - b.message_index;
            });
              //[...newMessages.reverse(), ...messages];
 
            setMessages(result);
            processMessageList(result);
 
          if (newMessages.length == 0) {
            setCompleted(true);
          }
     
         // if (contentRef.current)
         //   (contentRef.current as HTMLElement).scrollTop += (contentRef.current as HTMLElement).clientHeight - originalHeight;
        });
    }

    const loadMessages = async (scroll = false) => {
        
        if (loading || loadingMoreMessages || checkingNewMessages)
            return false;

        setLoading(true);
        const response = await getMessages(id);

        const newMessages = response.data.reverse();
        setMessages(newMessages);
        processMessageList(newMessages);

        if (scroll) {
            setTimeout(() => {
                scrollToBottom();
            }, 200);
        }

        //mark as read on message got loaded

        markReadClicked();

        setLoading(false);
    };

    const processMessageList = (messages: ChatMessage[]) => {

        /*const groupedMessages = messages.reduce((acc: any, message: any) => {
            const date = format(message.created_at, 'MMMM d, yyyy');
            if (!acc[date]) {
                acc[date] = { date, messages: [] };
            }
            acc[date].messages.push(message);
            return acc;
        }, {});*/

        let groupedMessages: any = {};

        for(let message of messages) {
            const date = format(message.created_at, 'MMMM d, yyyy');
            if (!groupedMessages[date]) {
                groupedMessages[date] = { date, messages: [] };
            }
            groupedMessages[date].messages.push(message);
        }

        setMessageGroups(Object.values(groupedMessages));
    };

    async function checkNewMessages(scroll = false) {
        if (loading || loadingMoreMessages) 
            return;
        
        const latestMessageIndex = messages.length > 0 ? messages[messages.length - 1].message_index : null;
        const newMessages = await getNewMessages(id, latestMessageIndex);

        if (newMessages.length > 0) {

            const result = newMessages.reverse().concat(messages).sort((a: ChatMessage, b: ChatMessage) => {
                return a.message_index - b.message_index;
              });
              //[...newMessages.reverse(), ...messages];

            setMessages(result);
            processMessageList(result);

            setHaveUnreadMessage(true);

            // if it was at bottom or new message sent, then move to bottom and mark as read

            if (isScrolledToBottom || scroll) {
                markReadClicked();
                scrollToBottom();

                //if latest messages from agent(s)

            } else if (newMessages.length > 0 && newMessages[0]['message_sender_type'] == 1) {
                setHaveUnreadMessage(true);// show alert for new message
            }
        }
    };

    const sendMessage = async () => {
        if (!txtMessage) return;
        setSendingMessage(true);
        const resp = await postChatMessage(id, txtMessage);
        if (resp.operation == 'success') {
            setTxtMessage('');
            checkNewMessage(true);
        } else {
            alertDialog({
                title: t('Error'),
                description: errorMessage(resp.message)
            })
        }
         
        setSendingMessage(false);
    };

    const scrollToBottom = () => {

        if (contentRef.current) {
            const ele = (contentRef.current as HTMLElement);
            
            setTimeout(() => {
                ele.scrollTop = ele.scrollHeight - ele.clientHeight + 119;
            }, 200);
        }
    };
 
    const markReadClicked = async () => {
        setHaveUnreadMessage(false);
        await markRead(id);
    };
    
    //{chat ? chat.contact?.contact_name || chat.staff?.staff_name : 
    //<span className="skeleton-text">Loading...</span>}

    return (
        <Suspense fallback={<Loading />}>
            <DashLayout>
            <div className=' bg-white'>
                <div className="max-w-4xl mx-auto px-6 shadow-[0px_10px_20px_0px_rgba(0,0,0,0.05) xs:pt-0 sm:pt-6 pb-6">

                    <h5 className='text-[color:var(--Neutral-95,#23233D)] text-2xl font-bold leading-8 capitalize'>
                        { chat && <>
                            { chat.staff && chat.staff.staff_name }
                            { chat.contact && chat.contact.contact_name }

                            { chat.store && <>
                                <br />
                                <small>{chat.store.store_name}</small>
                            </>} 
                        </>}     
                    </h5>

                </div>    
            </div>
            
            <div className="max-w-4xl mx-auto p-6 xs:h-[calc(100vh-180px)] sm:h-[calc(100vh-290px)] overflow-y-auto " ref={contentRef} onScroll={onScroll}>
 
                {loading && (
                    <div className="text-center"><span className="skeleton-text">{t("Loading messages...")}</span></div>
                )} 
                
                { chat && messageGroups.map((group: any) => (
                        <div key={group.date}>
                            <div className="date text-center my-2">{group.date}</div>
                            {group.messages.map((message: any) => (
                                <ChatMessageComponent message={message} chat={chat} />
                            ))}
                        </div>
                    ))
                }

                {haveUnreadMessage && (!contentRef.current || (contentRef.current as HTMLElement).scrollTop > 150) && (
                    <button className="alert-new-message" 
                        onClick={() => { markReadClicked(); scrollToBottom(); }}>
                        {t("New message")}
                    </button>
                )}
            </div>

            <footer className="bg-white p-4 fixed bottom-0 w-full">
                <div className="flex max-w-4xl mx-auto xs:px-4 sm:px-6">
                    <input
                        type="text"
                        value={txtMessage}
                        onKeyUp={(e) => {
                            if (e.key === 'Enter') {
                                sendMessage();
                            }
                        }}
                        onChange={(e) => setTxtMessage(e.target.value)}
                        placeholder={t('Type message here')}
                        className="w-[calc(100%-65px)] txt-message px-4 me-4 focus:outline-none focus:ring-0 bg-slate-100 radius-r-8"
                    />
                    <Button className="btn-send" onClick={sendMessage} disabled={sendingMessage}>
                        {sendingMessage ? <span>{t("Sending...")}</span> : <span>{t("Send")}</span>}
                    </Button>
                </div>
            </footer>
            </DashLayout>
        </Suspense>
    );
};

export default ChatViewPage;