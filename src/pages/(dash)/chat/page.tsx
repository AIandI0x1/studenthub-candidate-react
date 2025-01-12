"use client"
import { ChatComponent } from '@/components/app/chat';
// app/(dash)/chat/ChatListPage.tsx

import NoItems from '@/components/common/no-items';
import Pager from '@/components/common/pager';
import { Chat } from '@/models/chat';
import { page, track } from '@/providers/analytics.service';
import { alertCount$ } from '@/providers/event.service';
import { listChats } from '@/providers/logged-in/chat.service';
import { StoreState, useAppSelector } from '@/store/store';
import { useIonRouter } from '@ionic/react';    
import React, { useEffect, useState, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import Loading from './loading';

const ChatListPage = () => {
    const router = useIonRouter();
    const { t } = useTranslation();

    const [chats, setChats] = useState<Chat[]>([]);
    const [loading, setLoading] = useState(false);  

    const [pagination, setPagination] = useState({
        current_page: 1,
        total_pages: 1,
    });
    
    const { totalUnreadMessages} = useAppSelector((state: StoreState) => state.app);

    useEffect(() => {
        loadChatData();
        const subscription = alertCount$.subscribe((data: any) => {
            if (data && data.total !== totalUnreadMessages) {
                loadChatData();
            }
            updateChatData(data);
        });
 
        page('Chat List Page');

        //router.prefetch('/chat/[id]');

        return () => {
            track('page_exit', { page: 'Chat List Page' });
            subscription.unsubscribe();
        }
    }, []);

    const loadChatData = async (page = 1) => {
        setLoading(true);
        const response = await listChats(page, {});
        setLoading(false);

        setPagination({
            current_page: parseInt(response.headers['x-pagination-current-page']),
            total_pages: parseInt(response.headers['x-pagination-page-count']),
        });
           
        setChats(response.data);
    };

    const updateChatData = (data: any) => {
        if (!chats) return;
        chats.forEach((chat: any) => {
            if (data[chat.chat_uuid]) {
                chat.candidateUnreadCount = data[chat.chat_uuid].candidateUnreadCount;
                chat.recentMessage = data[chat.chat_uuid].recentMessage;
            }
        });
        setChats([...chats].sort((a: any, b: any) => b.candidateUnreadCount - a.candidateUnreadCount));
    };


  const loadPage = (page: number) => {

    if (page > pagination.total_pages || page < 1) {
      return;
    }

    setPagination({
      ...pagination,
      current_page: page
    });

    loadChatData(page);
  }

    const handleRefresh = () => {
        loadPage(1);
    };

    const handleChatDetail = (conversation: Chat) => {
        router.push(`/chat/${conversation.chat_uuid}`);
    };
    
    const onLogoError = (chat: Chat) => {
        if (chat.company) {
       //     chat.company.company_logo = null;
       //     setChats([...chats]);
        }
    };

    return (
        <Suspense fallback={<Loading />}>
            <div className=' bg-white'>
                <div className="max-w-4xl mx-auto px-6 shadow-[0px_10px_20px_0px_rgba(0,0,0,0.05) xs:pt-0 sm:pt-6 pb-6">

                    <h5 className='text-[color:var(--Neutral-95,#23233D)] text-2xl font-bold leading-8 capitalize'>
                    {t("Chats")}
                    </h5>
 
                </div>    
            </div>
            
            <div className="max-w-4xl mx-auto p-6">

                {chats.length === 0 && !loading && <NoItems image="assets/icons/no-invitation.svg" 
                        title={ 'You have no active chats' }
                        message={ '' } /> }

                {loading && <div>{t("Loading...")}</div>}

                {chats.map((chat: Chat) => (
                    <ChatComponent chat={chat} key={chat.chat_uuid} onLogoError={() => onLogoError(chat)} 
                        onClick={() => handleChatDetail(chat)} />
                ))}

                <Pager pagination={pagination} loadPage={loadPage} />
        
            </div> 
        </Suspense>
    );
};

export default ChatListPage;